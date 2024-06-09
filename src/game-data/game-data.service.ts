import { Injectable } from '@nestjs/common';
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

  // async getLeaderBoard() {
  //   const users = await this.userModel
  //     .find()
  //     .sort({ 'treasures.length': -1 })
  //     .limit(10)
  //     .populate('treasures');
  //   return users.map((user) => ({
  //     email: user.email, // Assuming email is displayed publicly in the leaderboard
  //     treasuresCollected: user.treasures.length,
  //   }));
  // }

  // async tradeTreasure(userId1: string, userId2: string, treasureId: string) {
  //   const user1 = await this.userModel.findById(userId1);
  //   const user2 = await this.userModel.findById(userId2);

  //   const treasureToTrade = user1.treasures.find(
  //     (treasure) => treasure._id.toString() === treasureId,
  //   );

  //   if (!treasureToTrade) {
  //     throw new Error("Treasure not found in user's collection.");
  //   }

  //   // Perform atomic transaction using database sessions or transactions functionality

  //   user1.treasures.pull(treasureToTrade);
  //   user2.treasures.push(treasureToTrade);

  //   await Promise.all([user1.save(), user2.save()]);

  //   return { message: 'Treasure trade successful!' };
  // }

  // // Implement logic to detect and prevent cheating (e.g., treasure duplication or manipulation)
  // async detectCheating(userId: string) {
  //   // Implement logic to check for suspicious activity in user's treasure collection
  //   // This could involve analyzing timestamps, treasure types, etc.
  //   // Throw an error or take appropriate action if cheating is detected
  // }
}
