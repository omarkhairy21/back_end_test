import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GameDataService } from './game-data.service';
import { CreateGameDatumDto } from './dto/create-game-datum.dto';
import { UpdateGameDatumDto } from './dto/update-game-datum.dto';

@Controller('game-data')
export class GameDataController {
  constructor(private readonly gameDataService: GameDataService) {}

  @Post()
  create(@Body() createGameDatumDto: CreateGameDatumDto) {
    return this.gameDataService.create(createGameDatumDto);
  }

  @Get()
  findAll() {
    return this.gameDataService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gameDataService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGameDatumDto: UpdateGameDatumDto,
  ) {
    return this.gameDataService.update(+id, updateGameDatumDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gameDataService.remove(+id);
  }
}
