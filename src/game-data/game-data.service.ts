import { Injectable } from '@nestjs/common';
import { CreateGameDatumDto } from './dto/create-game-datum.dto';
import { UpdateGameDatumDto } from './dto/update-game-datum.dto';

@Injectable()
export class GameDataService {
  create(createGameDatumDto: CreateGameDatumDto) {
    return 'This action adds a new gameDatum';
  }

  findAll() {
    return `This action returns all gameData`;
  }

  findOne(id: number) {
    return `This action returns a #${id} gameDatum`;
  }

  update(id: number, updateGameDatumDto: UpdateGameDatumDto) {
    return `This action updates a #${id} gameDatum`;
  }

  remove(id: number) {
    return `This action removes a #${id} gameDatum`;
  }
}
