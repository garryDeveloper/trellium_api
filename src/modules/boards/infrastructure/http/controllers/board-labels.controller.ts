import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { FastifyRequest } from 'fastify';
import {
  JwtAuthGuard,
  VerifiedTokenPayload,
} from 'src/modules/iam/infrastructure/http/guards/jwt-auth.guard';
import { CreateLabelUseCase } from 'src/modules/boards/application/use-cases/create-label.use-case';
import { ListBoardLabelsUseCase } from 'src/modules/boards/application/use-cases/list-board-labels.use-case';
import { CreateLabelDto } from '../dto/create-label.dto';
import { LabelResponseDto } from '../dto/label.response.dto';
import { ListBoardLabelsResponseDto } from '../dto/list-board-labels.response.dto';
import { BoardResponseMapper } from '../mappers/board.response.mapper';

@ApiTags('boards')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Token inválido o expirado.' })
@UseGuards(JwtAuthGuard)
@Controller('boards/:boardId/labels')
export class BoardLabelsController {
  constructor(
    private readonly createLabelUseCase: CreateLabelUseCase,
    private readonly listBoardLabelsUseCase: ListBoardLabelsUseCase,
  ) {}

  @Get()
  @ApiOkResponse({ type: ListBoardLabelsResponseDto })
  async listLabels(
    @Param('boardId') boardId: string,
    @Req() req: FastifyRequest & { user: VerifiedTokenPayload },
  ): Promise<ListBoardLabelsResponseDto> {
    const labels = await this.listBoardLabelsUseCase.execute({
      boardId,
      userId: req.user.sub,
    });

    return {
      labels: labels.map((label) => BoardResponseMapper.toLabelDto(label)),
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: LabelResponseDto })
  async createLabel(
    @Param('boardId') boardId: string,
    @Body() dto: CreateLabelDto,
    @Req() req: FastifyRequest & { user: VerifiedTokenPayload },
  ): Promise<LabelResponseDto> {
    const label = await this.createLabelUseCase.execute({
      boardId,
      name: dto.name,
      color: dto.color,
      userId: req.user.sub,
    });

    return BoardResponseMapper.toLabelDto(label);
  }
}
