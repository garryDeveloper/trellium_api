import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../../shared/application/use-case.interface';
import { User } from '../../domain/entities/user.entity';
import { USER_REPOSITORY } from '../../domain/ports/user.repository';
import type { UserRepository } from '../../domain/ports/user.repository';
import { PASSWORD_HASHER } from '../ports/password-hasher.port';
import type { PasswordHasherPort } from '../ports/password-hasher.port';
import { TOKEN_ISSUER } from '../ports/token-issuer.port';
import type { TokenIssuerPort } from '../ports/token-issuer.port';
import { ExistingEmailError } from '../../domain/errors/existing-email.error';

export interface RegisterCommand {
  email: string;
  password: string;
  name: string;
}

export interface RegisterResult {
  user: User;
  token: string;
}

@Injectable()
export class RegisterUseCase implements UseCase<
  RegisterCommand,
  RegisterResult
> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasherPort,
    @Inject(TOKEN_ISSUER) private readonly tokenIssuer: TokenIssuerPort,
  ) {}

  async execute(command: RegisterCommand): Promise<RegisterResult> {
    const existing = await this.users.findByEmail(command.email);
    if (existing) {
      throw new ExistingEmailError();
    }

    const passwordHash = await this.passwordHasher.hash(command.password);
    const user = User.create({
      email: command.email,
      passwordHash,
      name: command.name,
    });
    const userCreated = await this.users.create(user);

    const token = await this.tokenIssuer.issue({
      sub: userCreated.id,
      email: userCreated.email,
    });

    return { user: userCreated, token };
  }
}
