import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { FastifyRequest } from 'fastify';
import {
  JwtAuthGuard,
  VerifiedTokenPayload,
} from 'src/modules/iam/infrastructure/http/guards/jwt-auth.guard';
import { GetBoardViewPreferencesUseCase } from 'src/modules/boards/application/use-cases/get-board-view-preferences.use-case';
import { SaveBoardViewPreferencesUseCase } from 'src/modules/boards/application/use-cases/save-board-view-preferences.use-case';
import { BoardViewPreferencesResponseDto } from '../dto/board-view-preferences.response.dto';
import { SaveBoardViewPreferencesRequestDto } from '../dto/save-board-view-preferences.request.dto';
import { BoardResponseMapper } from '../mappers/board.response.mapper';

@ApiTags('boards')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Token inválido o expirado.' })
@ApiForbiddenResponse({ description: 'El usuario no es miembro del tablero.' })
@UseGuards(JwtAuthGuard)
@Controller('boards/:boardId/view-preferences')
export class BoardViewPreferencesController {
  constructor(
    private readonly getBoardViewPreferencesUseCase: GetBoardViewPreferencesUseCase,
    private readonly saveBoardViewPreferencesUseCase: SaveBoardViewPreferencesUseCase,
  ) {}

  @Get()
  @ApiOkResponse({ type: BoardViewPreferencesResponseDto })
  async getPreferences(
    @Param('boardId') boardId: string,
    @Req() req: FastifyRequest & { user: VerifiedTokenPayload },
  ): Promise<BoardViewPreferencesResponseDto> {
    const preferences = await this.getBoardViewPreferencesUseCase.execute({
      boardId,
      userId: req.user.sub,
    });

    return BoardResponseMapper.toViewPreferencesDto(preferences);
  }

  @Put()
  @ApiOkResponse({ type: BoardViewPreferencesResponseDto })
  async savePreferences(
    @Param('boardId') boardId: string,
    @Body() dto: SaveBoardViewPreferencesRequestDto,
    @Req() req: FastifyRequest & { user: VerifiedTokenPayload },
  ): Promise<BoardViewPreferencesResponseDto> {
    const preferences = await this.saveBoardViewPreferencesUseCase.execute({
      boardId,
      userId: req.user.sub,
      view: dto.view,
      groupBy: dto.groupBy,
    });

    return BoardResponseMapper.toViewPreferencesDto(preferences);
  }
}
