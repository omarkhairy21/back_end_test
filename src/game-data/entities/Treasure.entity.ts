import { User } from '@/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  Index,
} from 'typeorm';

@Entity()
export class Treasure {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(() => UserTreasure, (userTreasure) => userTreasure.treasure)
  userTreasures: UserTreasure[];
}

@Entity()
@Index(['user', 'collectedAt'], { unique: true })
export class UserTreasure {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.treasures)
  user: User;

  @ManyToOne(() => Treasure, (treasure) => treasure.userTreasures)
  treasure: Treasure;

  @Column()
  collectedAt: Date;
}

// tade entit

@Entity()
export class Trade {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tradeTokens: number;

  @OneToOne(() => User)
  fromUserId: number;

  @OneToOne(() => User)
  toUserId: number;

  @Column()
  tradeStatus: string;

  @Column()
  tradeDate: Date;
}
