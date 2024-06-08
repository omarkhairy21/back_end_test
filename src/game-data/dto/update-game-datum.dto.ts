import { PartialType } from '@nestjs/swagger';
import { CreateGameDatumDto } from './create-game-datum.dto';

export class UpdateGameDatumDto extends PartialType(CreateGameDatumDto) {}
