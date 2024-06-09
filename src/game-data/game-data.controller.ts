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
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

@Controller('game')
@ApiTags('Game Data')
export class GameDataController {
  constructor(private readonly gameDataService: GameDataService) {}

  @Post('collect-treasure')
  @ApiOperation({ summary: 'Create game data' })
  @ApiCreatedResponse({
    description: 'The game data has been successfully created.',
  })
  @ApiBadRequestResponse({ description: 'Invalid request body.' })
  create(@Body() data: { userId: number; treasureId: number }) {
    return this.gameDataService.collectTreasure(data.userId, data.treasureId);
  }
}
