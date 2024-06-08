import { Module } from '@nestjs/common';
import { GameDataService } from './game-data.service';
import { GameDataController } from './game-data.controller';

@Module({
  controllers: [GameDataController],
  providers: [GameDataService],
})
export class GameDataModule {}
