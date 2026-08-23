import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginUseCase } from '../../../application/use-cases/login.use-case';
import { AuthResponseDto } from '../dto/auth.response.dto';
import { LoginDto } from '../dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

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
}
