import { HttpException, Injectable } from '@nestjs/common';
import { Treasure, UserTreasure } from './entities/Treasure.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/user/entities/user.entity';

// Check daily and weekly collection limits
const dailyLimitReached = 10;
const weeklyLimitReached = 25;

@Injectable()
export class GameDataService {
  constructor(
    @InjectRepository(Treasure)
    private readonly treasureRepository: Repository<Treasure>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserTreasure)
    private userTreasureRepository: Repository<UserTreasure>,
  ) {}

  async createTreasure(name: string, description: string) {
    const treasure = this.treasureRepository.create({ name, description });
    await this.treasureRepository.save(treasure);
    return { message: 'Treasure created successfully!' };
  }

  async collectTreasure(userId: number, treasureId: number) {
    const today = new Date();

    const user = await this.userRepository.findOne({ where: { id: userId } });
    const treasure = await this.treasureRepository.findOne({
      where: { id: treasureId },
    });

    if (!user || !treasure) {
      throw new Error('User or Treasure not found');
    }

    // Check if daily limit is reached
    const dailyCollectionCount = await this.userTreasureRepository.count({
      where: {
        user,
        collectedAt: today,
      },
    });

    if (dailyCollectionCount >= dailyLimitReached) {
      throw new Error('Daily collection limit reached');
    }

    // Check if weekly limit is reached
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);

    const weeklyCollectionCount = await this.userTreasureRepository.count({
      where: {
        user,
        collectedAt: today,
      },
    });

    if (weeklyCollectionCount >= weeklyLimitReached) {
      throw new Error('Weekly collection limit reached');
    }

    await this.userTreasureRepository.save({
      user,
      treasure,
      collectedAt: new Date(),
    });

    return { message: 'Treasure collected successfully!' };
  }

  async getStats(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['treasures'],
    });

    if (!user) {
      throw new Error('User not found');
    }

    return {
      treasuresCollected: user.treasures.length,
    };
  }

  async getLeaderBoard() {
    const leaderboard = await this.userTreasureRepository
      .createQueryBuilder('userTreasure')
      .select('user.username', 'username')
      .addSelect('COUNT(userTreasure.treasureId)', 'treasuresCollected')
      .innerJoin('userTreasure.user', 'user')
      .groupBy('user.username')
      .orderBy('treasuresCollected', 'DESC')
      .getRawMany();

    return leaderboard;
  }

  async tradeTreasure(buyerId: number, sellerId: number, treasureId: number) {
    const entityManager = this.userRepository.manager;
    const message = await entityManager.transaction(
      async (transactionalEntityManager) => {
        const buyer = await transactionalEntityManager.findOne(User, {
          where: { id: buyerId },
        });

        const seller = await transactionalEntityManager.findOne(User, {
          where: { id: sellerId },
        });

        const treasure = await transactionalEntityManager.findOne(Treasure, {
          where: { id: treasureId },
          relations: ['userTreasures', 'userTreasures.user'],
        });

        if (!buyer || !seller || !treasure) {
          throw new HttpException(
            'Could not find buyer, seller, or treasure',
            400,
          );
        }

        // Check if seller has the treasure
        const userTreasure = treasure.userTreasures.find(
          (ut) => ut.user.id === seller.id,
        );

        if (!userTreasure) {
          throw new HttpException('Seller does not have the treasure', 400);
        }

        // Check if buyer has enough trade tokens
        if (buyer.tradeTokens < 1) {
          throw new HttpException(
            'Buyer does not have enough trade tokens',
            400,
          );
        }
        // Update trade tokens
        buyer.tradeTokens -= 1;

        seller.tradeTokens += 1;

        // Update treasure ownership
        userTreasure.user = buyer;

        // Save changes
        await transactionalEntityManager.save(buyer);

        await transactionalEntityManager.save(seller);

        await transactionalEntityManager.save(userTreasure);

        return { message: 'Treasure traded successfully!' };
      },
    );
    return message;
  }
}
