import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
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
import { UpdateLabelUseCase } from 'src/modules/boards/application/use-cases/update-label.use-case';
import { DeleteLabelUseCase } from 'src/modules/boards/application/use-cases/delete-label.use-case';
import { UpdateLabelRequestDto } from '../dto/update-label.request.dto';
import { LabelResponseDto } from '../dto/label.response.dto';
import { BoardResponseMapper } from '../mappers/board.response.mapper';

@ApiTags('boards')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Token inválido o expirado.' })
@UseGuards(JwtAuthGuard)
@Controller('labels')
export class LabelsController {
  constructor(
    private readonly updateLabelUseCase: UpdateLabelUseCase,
    private readonly deleteLabelUseCase: DeleteLabelUseCase,
  ) {}

  @Patch('/:labelId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: LabelResponseDto })
  async updateLabel(
    @Param('labelId') labelId: string,
    @Body() dto: UpdateLabelRequestDto,
    @Req() req: FastifyRequest & { user: VerifiedTokenPayload },
  ): Promise<LabelResponseDto> {
    const label = await this.updateLabelUseCase.execute({
      labelId,
      name: dto.name,
      color: dto.color,
      userId: req.user.sub,
    });

    return BoardResponseMapper.toLabelDto(label);
  }

  @Delete('/:labelId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Etiqueta eliminada.' })
  async deleteLabel(
    @Param('labelId') labelId: string,
    @Req() req: FastifyRequest & { user: VerifiedTokenPayload },
  ): Promise<void> {
    await this.deleteLabelUseCase.execute({
      labelId,
      userId: req.user.sub,
    });
  }
}
