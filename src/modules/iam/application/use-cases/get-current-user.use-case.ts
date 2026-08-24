import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../../shared/application/use-case.interface';
import { User } from '../../domain/entities/user.entity';
import { UserNotFoundError } from '../../domain/errors/user-not-found.error';
import { USER_REPOSITORY } from '../../domain/ports/user.repository';
import type { UserRepository } from '../../domain/ports/user.repository';

export interface GetCurrentUserCommand {
  userId: string;
}

@Injectable()
export class GetCurrentUserUseCase implements UseCase<
  GetCurrentUserCommand,
  User
> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
  ) {}

  async execute(command: GetCurrentUserCommand): Promise<User> {
    const user = await this.users.findById(command.userId);
    if (!user) {
      throw new UserNotFoundError();
    }

    return user;
  }
}
