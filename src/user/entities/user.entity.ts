import { UserTreasure } from '@/game-data/entities/Treasure.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: 0 })
  treasuresCollected: number;

  @OneToMany(() => UserTreasure, (userTreasure) => userTreasure.user)
  treasures: UserTreasure[];

  @Column({ default: 0 })
  tradeTokens: number;
}
