import { Module } from '@nestjs/common';
import { GameDataService } from './game-data.service';
import { GameDataController } from './game-data.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Treasure, UserTreasure } from './entities/Treasure.entity';
import { User } from '@/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Treasure, UserTreasure, User])],
  controllers: [GameDataController],
  providers: [GameDataService],
})
export class GameDataModule {}
