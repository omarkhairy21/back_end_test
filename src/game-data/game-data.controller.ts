import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { GameDataService } from './game-data.service';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiBody,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('/')
@ApiTags('Game Data')
export class GameDataController {
  constructor(private readonly gameDataService: GameDataService) {}

  @Post('collect-treasure')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Create game data(Auth-JWT)' })
  @ApiCreatedResponse({
    description: 'The game data has been successfully created.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: {
          type: 'number',
          example: 1,
        },
        treasureId: {
          type: 'number',
          example: 1,
        },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid request body.' })
  create(@Body() data: { userId: number; treasureId: number }) {
    return this.gameDataService.collectTreasure(data.userId, data.treasureId);
  }

  @Get('stats')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Get collected treasure stats for the user(Auth-JWT)',
    description: 'Requires a valid JWT token.',
  })
  @ApiOkResponse({
    description: 'The stats have been successfully fetched.',
  })
  @ApiNotFoundResponse({ description: 'User not found.' })
  getStats(@Req() req) {
    return this.gameDataService.getStats(req.user.id);
  }

  // leaderboard
  @Get('leaderboard')
  @ApiOperation({ summary: 'Get leaderboard' })
  @ApiOkResponse({
    description: 'The leaderboard has been successfully fetched.',
  })
  getLeaderboard() {
    return this.gameDataService.getLeaderBoard();
  }

  // trade treasure
  @Post('trade-treasure')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Trade treasure(Auth-JWT)' })
  @ApiCreatedResponse({
    description: 'The treasure has been successfully traded.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        sellerId: {
          type: 'number',
          example: 2,
        },
        treasureId: {
          type: 'number',
          example: 1,
        },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid request body.' })
  tradeTreasure(
    @Body() data: { tradeTokens: number; sellerId: number; treasureId: number },
    @Req() req,
  ) {
    return this.gameDataService.tradeTreasure(
      req.user.id,
      data.sellerId,
      data.treasureId,
    );
  }

  // create treasure
  @Post('create-treasure')
  @ApiOperation({ summary: 'Create treasure' })
  @ApiCreatedResponse({
    description: 'The treasure has been successfully created.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'treasure1',
        },
        description: {
          type: 'string',
          example: 'description',
        },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid request body.' })
  createTreasure(@Body() data: { name: string; description: string }) {
    return this.gameDataService.createTreasure(data.name, data.description);
  }
}
