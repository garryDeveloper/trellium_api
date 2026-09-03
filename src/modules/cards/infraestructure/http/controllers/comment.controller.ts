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
import { CreateCommentUseCase } from '../../../application/use-cases/create-comment.use-case';
import { RemoveCommentUseCase } from '../../../application/use-cases/delete-comment.use-case';
import { ListCardCommentsUseCase } from '../../../application/use-cases/list-card-comments.use-case';
import { UpdateCommentUseCase } from '../../../application/use-cases/update-comment.use-case';
import { CreateCommentDto } from '../dto/create-comment.request';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import {
  CommentResponseDto,
  ListCommentsResponseDto,
} from '../dto/comment.response.dto';
import { CommentResponseMapper } from '../mappers/comment.response.mapper';

@ApiTags('comments')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Token inválido o expirado.' })
@UseGuards(JwtAuthGuard)
@Controller()
export class CommentController {
  constructor(
    private readonly listCommentsUseCase: ListCardCommentsUseCase,
    private readonly createCommentUseCase: CreateCommentUseCase,
    private readonly updateCommentUseCase: UpdateCommentUseCase,
    private readonly deleteCommentUseCase: RemoveCommentUseCase,
  ) {}

  @Get('cards/:cardId/comments')
  @ApiOkResponse({ type: ListCommentsResponseDto })
  async listComments(
    @Param('cardId') cardId: string,
    @Req() req: FastifyRequest & { user: VerifiedTokenPayload },
  ): Promise<ListCommentsResponseDto> {
    const comments = await this.listCommentsUseCase.execute({
      cardId,
      currentUserId: req.user.sub,
    });

    return {
      comments: comments.map((comment) =>
        CommentResponseMapper.toResponseDto(comment),
      ),
    };
  }

  @Post('cards/:cardId/comments')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: CommentResponseDto })
  async createComment(
    @Param('cardId') cardId: string,
    @Body() dto: CreateCommentDto,
    @Req() req: FastifyRequest & { user: VerifiedTokenPayload },
  ): Promise<CommentResponseDto> {
    const comment = await this.createCommentUseCase.execute({
      cardId,
      body: dto.body,
      currentUserId: req.user.sub,
    });

    return CommentResponseMapper.toResponseDto(comment);
  }

  @Patch('comments/:commentId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: CommentResponseDto })
  async updateComment(
    @Param('commentId') commentId: string,
    @Body() dto: UpdateCommentDto,
    @Req() req: FastifyRequest & { user: VerifiedTokenPayload },
  ): Promise<CommentResponseDto> {
    const comment = await this.updateCommentUseCase.execute({
      commentId,
      body: dto.body,
      currentUserId: req.user.sub,
    });

    return CommentResponseMapper.toResponseDto(comment);
  }

  @Delete('comments/:commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Comentario eliminado.' })
  async deleteComment(
    @Param('commentId') commentId: string,
    @Req() req: FastifyRequest & { user: VerifiedTokenPayload },
  ): Promise<void> {
    await this.deleteCommentUseCase.execute({
      commentId,
      currentUserId: req.user.sub,
    });
  }
}
