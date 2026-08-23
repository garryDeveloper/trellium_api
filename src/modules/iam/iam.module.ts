import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { JwtModule } from '@nestjs/jwt';
import type { SignOptions } from 'jsonwebtoken';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { PASSWORD_HASHER } from './application/ports/password-hasher.port';
import { TOKEN_ISSUER } from './application/ports/token-issuer.port';
import { USER_REPOSITORY } from './domain/ports/user.repository';
import { Argon2PasswordHasherAdapter } from './infrastructure/adapters/argon2-password-hasher.adapter';
import { JwtTokenIssuerAdapter } from './infrastructure/adapters/jwt-token-issuer.adapter';
import { UserMikroEntity } from './infrastructure/persistence/mikro-orm/entities/user.mikro-entity';
import { MikroOrmUserRepository } from './infrastructure/persistence/mikro-orm/repositories/mikro-orm-user.repository';
import { AuthController } from './infrastructure/http/controllers/auth.controller';

@Module({
  imports: [
    MikroOrmModule.forFeature([UserMikroEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: (process.env.JWT_EXPIRES_IN ??
          '7d') as SignOptions['expiresIn'],
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    { provide: USER_REPOSITORY, useClass: MikroOrmUserRepository },
    { provide: PASSWORD_HASHER, useClass: Argon2PasswordHasherAdapter },
    { provide: TOKEN_ISSUER, useClass: JwtTokenIssuerAdapter },
  ],
  exports: [USER_REPOSITORY],
})
export class IamModule {}
