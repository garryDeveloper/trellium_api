import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../../shared/application/use-case.interface';
import { User } from '../../domain/entities/user.entity';
import { UserNotFoundError } from '../../domain/errors/user-not-found.error';
import { USER_REPOSITORY } from '../../domain/ports/user.repository';
import type { UserRepository } from '../../domain/ports/user.repository';

export interface UpdateProfileCommand {
  userId: string;
  name: string;
}

@Injectable()
export class UpdateProfileUseCase implements UseCase<
  UpdateProfileCommand,
  User
> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
  ) {}

  async execute(command: UpdateProfileCommand): Promise<User> {
    const user = await this.users.findById(command.userId);
    if (!user) {
      throw new UserNotFoundError();
    }

    return this.users.update(user.rename(command.name));
  }
}
