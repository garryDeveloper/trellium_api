import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { Invitation } from '../../../../domain/entities/invitation.entity';
import {
  InvitationRepository,
  InvitationSummary,
} from '../../../../domain/ports/invitation.repository';
import { InvitationMikroEntity } from '../entities/invitation.mikro-entity';
import { InvitationMapper } from '../mappers/invitation.mapper';

@Injectable()
export class MikroOrmInvitationRepository implements InvitationRepository {
  constructor(private readonly em: EntityManager) {}

  async findPendingByBoardAndEmail(
    boardId: string,
    email: string,
  ): Promise<Invitation | null> {
    const row = await this.em.findOne(InvitationMikroEntity, {
      board: boardId,
      invitedEmail: email,
      status: 'pending',
    });

    return row ? InvitationMapper.toDomain(row) : null;
  }

  async findById(invitationId: string): Promise<Invitation | null> {
    const row = await this.em.findOne(InvitationMikroEntity, {
      id: invitationId,
    });

    return row ? InvitationMapper.toDomain(row) : null;
  }

  async findPendingByEmail(email: string): Promise<InvitationSummary[]> {
    const rows = await this.em.find(
      InvitationMikroEntity,
      { invitedEmail: email, status: 'pending' },
      { populate: ['board', 'invitedBy'], orderBy: { createdAt: 'desc' } },
    );

    return rows.map((row) => ({
      invitation: InvitationMapper.toDomain(row),
      boardName: row.board.name,
      invitedBy: {
        id: row.invitedBy.id,
        name: row.invitedBy.name,
        email: row.invitedBy.email,
      },
    }));
  }

  async findPendingByBoard(boardId: string): Promise<Invitation[]> {
    const rows = await this.em.find(
      InvitationMikroEntity,
      { board: boardId, status: 'pending' },
      { orderBy: { createdAt: 'desc' } },
    );

    return rows.map((row) => InvitationMapper.toDomain(row));
  }

  async create(invitation: Invitation): Promise<Invitation> {
    const row = this.em.create(
      InvitationMikroEntity,
      InvitationMapper.toPersistence(invitation),
    );
    await this.em.persist(row).flush();
    return InvitationMapper.toDomain(row);
  }

  async update(invitation: Invitation): Promise<Invitation> {
    const ref = this.em.getReference(InvitationMikroEntity, invitation.id);
    this.em.assign(ref, InvitationMapper.toPersistence(invitation));
    await this.em.flush();
    return invitation;
  }

  async delete(invitationId: string): Promise<void> {
    await this.em.nativeDelete(InvitationMikroEntity, { id: invitationId });
  }
}
