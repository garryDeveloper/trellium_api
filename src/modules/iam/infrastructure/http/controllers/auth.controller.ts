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
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { FastifyRequest } from 'fastify';
import { LoginUseCase } from '../../../application/use-cases/login.use-case';
import { LogoutUseCase } from '../../../application/use-cases/logout.use-case';
import { RegisterUseCase } from '../../../application/use-cases/register.use-case';
import { JwtAuthGuard, VerifiedTokenPayload } from '../guards/jwt-auth.guard';
import { AuthResponseDto } from '../dto/auth.response.dto';
import { LoginDto } from '../dto/login.dto';
import { RegisterRequestDto } from '../dto/register.request.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly logoutUseCase: LogoutUseCase,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: AuthResponseDto })
  @ApiUnauthorizedResponse({ description: 'Credenciales inválidas.' })
  async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    const { user, token } = await this.loginUseCase.execute({
      email: dto.email,
      password: dto.password,
    });

    return {
      user: { id: user.id, name: user.name, email: user.email },
      token,
    };
  }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: AuthResponseDto })
  async register(@Body() dto: RegisterRequestDto): Promise<AuthResponseDto> {
    const { user, token } = await this.registerUseCase.execute({
      email: dto.email,
      password: dto.password,
      name: dto.name,
    });

    return {
      user: { id: user.id, name: user.name, email: user.email },
      token,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiNoContentResponse({ description: 'Sesión cerrada.' })
  @ApiUnauthorizedResponse({ description: 'Token inválido o expirado.' })
  async logout(
    @Req() req: FastifyRequest & { user: VerifiedTokenPayload },
  ): Promise<void> {
    await this.logoutUseCase.execute({
      jti: req.user.jti,
      expiresAt: new Date(req.user.exp * 1000),
    });
  }
}
