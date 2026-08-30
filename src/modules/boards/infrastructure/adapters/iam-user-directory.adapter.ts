import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from 'src/modules/iam/domain/ports/user.repository';
import type { UserRepository } from 'src/modules/iam/domain/ports/user.repository';
import { UserDirectoryPort } from '../../application/ports/user-directory.port';

@Injectable()
export class IamUserDirectoryAdapter implements UserDirectoryPort {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
  ) {}

  async findUserIdByEmail(email: string): Promise<string | null> {
    const user = await this.users.findByEmail(email);
    return user ? user.id : null;
  }
}
