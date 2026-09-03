import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { FastifyRequest } from 'fastify';
import {
  JwtAuthGuard,
  VerifiedTokenPayload,
} from 'src/modules/iam/infrastructure/http/guards/jwt-auth.guard';
import { CreateChecklistUseCase } from '../../../application/use-cases/create-checklist.use-case';
import { AddChecklistItemUseCase } from '../../../application/use-cases/add-checklist-item.use-case';
import { ListCardChecklistsUseCase } from '../../../application/use-cases/list-card-checklists.use-case';
import { UpdateChecklistItemUseCase } from '../../../application/use-cases/update-checklist-item.use-case';
import { DeleteChecklistItemUseCase } from '../../../application/use-cases/delete-checklist-item.use-case';
import { DeleteChecklistUseCase } from '../../../application/use-cases/delete-checklist.use-case';
import { CreateChecklistDto } from '../dto/create-checklist.dto';
import { CreateChecklistItemDto } from '../dto/create-checklist-item.dto';
import { UpdateChecklistItemDto } from '../dto/update-checklist-item.dto';
import {
  ChecklistItemResponseDto,
  ChecklistResponseDto,
  ListChecklistsResponseDto,
} from '../dto/checklist.response.dto';
import { ChecklistResponseMapper } from '../mappers/checklist.response.mapper';

@ApiTags('checklists')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Token inválido o expirado.' })
@UseGuards(JwtAuthGuard)
@Controller()
export class ChecklistsController {
  constructor(
    private readonly createChecklistUseCase: CreateChecklistUseCase,
    private readonly addChecklistItemUseCase: AddChecklistItemUseCase,
    private readonly listCardChecklistsUseCase: ListCardChecklistsUseCase,
    private readonly updateChecklistItemUseCase: UpdateChecklistItemUseCase,
    private readonly deleteChecklistItemUseCase: DeleteChecklistItemUseCase,
    private readonly deleteChecklistUseCase: DeleteChecklistUseCase,
  ) {}

  @Get('cards/:cardId/checklists')
  @ApiOkResponse({ type: ListChecklistsResponseDto })
  async listChecklists(
    @Param('cardId') cardId: string,
    @Req() req: FastifyRequest & { user: VerifiedTokenPayload },
  ): Promise<ListChecklistsResponseDto> {
    const checklists = await this.listCardChecklistsUseCase.execute({
      cardId,
      currentUserId: req.user.sub,
    });

    return {
      checklists: checklists.map(({ checklist, items }) =>
        ChecklistResponseMapper.toResponseDto(checklist, items),
      ),
    };
  }

  @Post('cards/:cardId/checklists')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: ChecklistResponseDto })
  async createChecklist(
    @Param('cardId') cardId: string,
    @Body() dto: CreateChecklistDto,
    @Req() req: FastifyRequest & { user: VerifiedTokenPayload },
  ): Promise<ChecklistResponseDto> {
    const checklist = await this.createChecklistUseCase.execute({
      cardId,
      name: dto.name,
      currentUserId: req.user.sub,
    });

    return ChecklistResponseMapper.toResponseDto(checklist, []);
  }

  @Post('checklists/:checklistId/items')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: ChecklistItemResponseDto })
  async addChecklistItem(
    @Param('checklistId') checklistId: string,
    @Body() dto: CreateChecklistItemDto,
    @Req() req: FastifyRequest & { user: VerifiedTokenPayload },
  ): Promise<ChecklistItemResponseDto> {
    const item = await this.addChecklistItemUseCase.execute({
      checklistId,
      text: dto.text,
      currentUserId: req.user.sub,
    });

    return ChecklistResponseMapper.toItemResponseDto(item);
  }

  @Patch('checklist-items/:itemId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ChecklistItemResponseDto })
  async updateChecklistItem(
    @Param('itemId') itemId: string,
    @Body() dto: UpdateChecklistItemDto,
    @Req() req: FastifyRequest & { user: VerifiedTokenPayload },
  ): Promise<ChecklistItemResponseDto> {
    const item = await this.updateChecklistItemUseCase.execute({
      itemId,
      text: dto.text,
      completed: dto.completed,
      currentUserId: req.user.sub,
    });

    return ChecklistResponseMapper.toItemResponseDto(item);
  }

  @Delete('checklist-items/:itemId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Ítem eliminado.' })
  async deleteChecklistItem(
    @Param('itemId') itemId: string,
    @Req() req: FastifyRequest & { user: VerifiedTokenPayload },
  ): Promise<void> {
    await this.deleteChecklistItemUseCase.execute({
      itemId,
      currentUserId: req.user.sub,
    });
  }

  @Delete('checklists/:checklistId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'Checklist eliminada, junto con todos sus ítems.',
  })
  async deleteChecklist(
    @Param('checklistId') checklistId: string,
    @Req() req: FastifyRequest & { user: VerifiedTokenPayload },
  ): Promise<void> {
    await this.deleteChecklistUseCase.execute({
      checklistId,
      currentUserId: req.user.sub,
    });
  }
}
