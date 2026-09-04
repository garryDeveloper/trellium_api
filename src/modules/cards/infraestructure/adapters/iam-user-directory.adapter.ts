import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from 'src/modules/iam/domain/ports/user.repository';
import type { UserRepository } from 'src/modules/iam/domain/ports/user.repository';
import {
  DirectoryUser,
  UserDirectoryPort,
} from '../../application/ports/user-directory.port';

@Injectable()
export class IamUserDirectoryAdapter implements UserDirectoryPort {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
  ) {}

  async findUserById(userId: string): Promise<DirectoryUser | null> {
    const user = await this.users.findById(userId);
    return user ? { id: user.id, name: user.name } : null;
  }
}
