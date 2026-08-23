import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../../shared/application/use-case.interface';
import { User } from '../../domain/entities/user.entity';
import { InvalidCredentialsError } from '../../domain/errors/invalid-credentials.error';
import { USER_REPOSITORY } from '../../domain/ports/user.repository';
import type { UserRepository } from '../../domain/ports/user.repository';
import { PASSWORD_HASHER } from '../ports/password-hasher.port';
import type { PasswordHasherPort } from '../ports/password-hasher.port';
import { TOKEN_ISSUER } from '../ports/token-issuer.port';
import type { TokenIssuerPort } from '../ports/token-issuer.port';

export interface LoginCommand {
  email: string;
  password: string;
}

export interface LoginResult {
  user: User;
  token: string;
}

@Injectable()
export class LoginUseCase implements UseCase<LoginCommand, LoginResult> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasherPort,
    @Inject(TOKEN_ISSUER) private readonly tokenIssuer: TokenIssuerPort,
  ) {}

  async execute(command: LoginCommand): Promise<LoginResult> {
    const user = await this.users.findByEmail(command.email);
    if (!user) {
      throw new InvalidCredentialsError();
    }

    const passwordMatches = await this.passwordHasher.compare(
      command.password,
      user.passwordHash,
    );
    if (!passwordMatches) {
      throw new InvalidCredentialsError();
    }

    const token = await this.tokenIssuer.issue({
      sub: user.id,
      email: user.email,
    });

    return { user, token };
  }
}
