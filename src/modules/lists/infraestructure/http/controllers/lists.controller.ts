import { Body, Controller, HttpCode, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { FastifyRequest } from 'fastify';
import {
  JwtAuthGuard,
  VerifiedTokenPayload,
} from 'src/modules/iam/infrastructure/http/guards/jwt-auth.guard';
import { CreateListUseCase } from '../../../application/use-cases/create-list.use-case';
import { CreateListDto } from '../dto/create-list.dto';
import { ListResponseDto } from '../dto/list.response.dto';
import { ListResponseMapper } from '../mappers/list.response.mapper';

@ApiTags('lists')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Token inválido o expirado.' })
@UseGuards(JwtAuthGuard)
@Controller('boards/:boardId/lists')
export class ListsController {
  constructor(private readonly createListUseCase: CreateListUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: ListResponseDto })
  async createList(
    @Param('boardId') boardId: string,
    @Body() dto: CreateListDto,
    @Req() req: FastifyRequest & { user: VerifiedTokenPayload },
  ): Promise<ListResponseDto> {
    const list = await this.createListUseCase.execute({
      boardId,
      name: dto.name,
      currentUserId: req.user.sub,
    });

    return ListResponseMapper.toResponseDto(list);
  }
}
