import { User } from '@/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
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