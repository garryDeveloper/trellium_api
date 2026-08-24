import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { FastifyRequest } from 'fastify';
import { GetCurrentUserUseCase } from '../../../application/use-cases/get-current-user.use-case';
import { UpdateProfileUseCase } from '../../../application/use-cases/update-profile.use-case';
import { JwtAuthGuard, VerifiedTokenPayload } from '../guards/jwt-auth.guard';
import { UpdateProfileRequestDto } from '../dto/update-profile.request.dto';
import { UserResponseDto } from '../dto/user.response.dto';

@ApiTags('me')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Token inválido o expirado.' })
@UseGuards(JwtAuthGuard)
@Controller('me')
export class MeController {
  constructor(
    private readonly getCurrentUserUseCase: GetCurrentUserUseCase,
    private readonly updateProfileUseCase: UpdateProfileUseCase,
  ) {}

  @Get()
  @ApiOkResponse({ type: UserResponseDto })
  async getCurrentUser(
    @Req() req: FastifyRequest & { user: VerifiedTokenPayload },
  ): Promise<UserResponseDto> {
    const user = await this.getCurrentUserUseCase.execute({
      userId: req.user.sub,
    });

    return { id: user.id, name: user.name, email: user.email };
  }

  @Patch()
  @ApiOkResponse({ type: UserResponseDto })
  async updateProfile(
    @Req() req: FastifyRequest & { user: VerifiedTokenPayload },
    @Body() dto: UpdateProfileRequestDto,
  ): Promise<UserResponseDto> {
    const user = await this.updateProfileUseCase.execute({
      userId: req.user.sub,
      name: dto.name,
    });

    return { id: user.id, name: user.name, email: user.email };
  }
}
