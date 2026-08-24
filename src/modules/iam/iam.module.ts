import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { JwtModule } from '@nestjs/jwt';
import type { SignOptions } from 'jsonwebtoken';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { LogoutUseCase } from './application/use-cases/logout.use-case';
import { RegisterUseCase } from './application/use-cases/register.use-case';
import { GetCurrentUserUseCase } from './application/use-cases/get-current-user.use-case';
import { UpdateProfileUseCase } from './application/use-cases/update-profile.use-case';
import { PASSWORD_HASHER } from './application/ports/password-hasher.port';
import { TOKEN_ISSUER } from './application/ports/token-issuer.port';
import { USER_REPOSITORY } from './domain/ports/user.repository';
import { REVOKED_TOKEN_REPOSITORY } from './domain/ports/revoked-token.repository';
import { Argon2PasswordHasherAdapter } from './infrastructure/adapters/argon2-password-hasher.adapter';
import { JwtTokenIssuerAdapter } from './infrastructure/adapters/jwt-token-issuer.adapter';
import { UserMikroEntity } from './infrastructure/persistence/mikro-orm/entities/user.mikro-entity';
import { RevokedTokenMikroEntity } from './infrastructure/persistence/mikro-orm/entities/revoked-token.mikro-entity';
import { MikroOrmUserRepository } from './infrastructure/persistence/mikro-orm/repositories/mikro-orm-user.repository';
import { MikroOrmRevokedTokenRepository } from './infrastructure/persistence/mikro-orm/repositories/mikro-orm-revoked-token.repository';
import { AuthController } from './infrastructure/http/controllers/auth.controller';
import { MeController } from './infrastructure/http/controllers/me.controller';
import { JwtAuthGuard } from './infrastructure/http/guards/jwt-auth.guard';
import { RevokedTokenCleanupTask } from './infrastructure/tasks/revoked-token-cleanup.task';

@Module({
  imports: [
    MikroOrmModule.forFeature([UserMikroEntity, RevokedTokenMikroEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: (process.env.JWT_EXPIRES_IN ??
          '7d') as SignOptions['expiresIn'],
      },
    }),
  ],
  controllers: [AuthController, MeController],
  providers: [
    LoginUseCase,
    RegisterUseCase,
    LogoutUseCase,
    GetCurrentUserUseCase,
    UpdateProfileUseCase,
    JwtAuthGuard,
    RevokedTokenCleanupTask,
    { provide: USER_REPOSITORY, useClass: MikroOrmUserRepository },
    { provide: PASSWORD_HASHER, useClass: Argon2PasswordHasherAdapter },
    { provide: TOKEN_ISSUER, useClass: JwtTokenIssuerAdapter },
    {
      provide: REVOKED_TOKEN_REPOSITORY,
      useClass: MikroOrmRevokedTokenRepository,
    },
  ],
  exports: [USER_REPOSITORY, JwtAuthGuard],
})
export class IamModule {}
