import { UserTreasure } from '@/game-data/entities/Treasure.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  BeforeInsert,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
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

  // Before saving the user, hash the password
  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
