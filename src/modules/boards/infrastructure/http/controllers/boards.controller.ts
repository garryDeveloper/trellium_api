import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { FastifyRequest } from 'fastify';
import { CreateBoardUseCase } from '../../../application/use-cases/create-board.use-case';
import {
  JwtAuthGuard,
  VerifiedTokenPayload,
} from 'src/modules/iam/infrastructure/http/guards/jwt-auth.guard';
import { CreateBoardDto } from '../dto/create-board.dto';
import { BoardResponseDto } from '../dto/board.response.dto';

@ApiTags('boards')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Token inválido o expirado.' })
@UseGuards(JwtAuthGuard)
@Controller('boards')
export class BoardsController {
  constructor(private readonly createBoardUseCase: CreateBoardUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: BoardResponseDto })
  async createBoard(
    @Body() dto: CreateBoardDto,
    @Req() req: FastifyRequest & { user: VerifiedTokenPayload },
  ): Promise<BoardResponseDto> {
    const board = await this.createBoardUseCase.execute({
      name: dto.name,
      ownerId: req.user.sub,
    });

    return {
      id: board.id,
      name: board.name,
      ownerId: board.ownerId,
      status: board.status,
      createdAt: board.createdAt.toISOString(),
    };
  }
}
