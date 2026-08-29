import { UseGuards, Controller, Post, HttpCode, HttpStatus, Body, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { JwtAuthGuard, VerifiedTokenPayload } from "src/modules/iam/infrastructure/http/guards/jwt-auth.guard";
import { BoardResponseDto } from "../dto/board.response.dto";
import { TransferOwnershiptRequestDto } from "../dto/transfer-ownership.request.dto";
import { FastifyRequest } from "fastify";

@ApiTags('boards')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Token inválido o expirado.' })
@UseGuards(JwtAuthGuard)
@Controller('board-members')
export class BoardMembersController {
    constructor(

    ) { }

    @Post(':/boardId/transfer-ownership')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: BoardResponseDto })
    async transferOwnership(
        @Body() dto: TransferOwnershiptRequestDto,
        @Req() req: FastifyRequest & { user: VerifiedTokenPayload },
    ): Promise<BoardResponseDto> {

    }
}