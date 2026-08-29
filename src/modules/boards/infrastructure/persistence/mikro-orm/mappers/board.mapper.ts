import { Board } from '../../../../domain/entities/board.entity';
import { BoardMember } from '../../../../domain/entities/board-member.entity';
import { BoardMikroEntity } from '../entities/board.mikro-entity';
import { BoardMemberMikroEntity } from '../entities/board-member.mikro-entity';

export class BoardMapper {
  static toDomain(entity: BoardMikroEntity): Board {
    return Board.fromPersistence({
      id: entity.id,
      name: entity.name,
      ownerId: entity.ownerId,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  static toPersistence(board: Board) {
    return {
      id: board.id,
      name: board.name,
      ownerId: board.ownerId,
      status: board.status,
      createdAt: board.createdAt,
      updatedAt: board.updatedAt,
    };
  }

  static memberToDomain(entity: BoardMemberMikroEntity): BoardMember {
    return BoardMember.fromPersistence({
      boardId: entity.board.id,
      userId: entity.user.id,
      joinedAt: entity.joinedAt,
    });
  }

  static memberToPersistence(member: BoardMember) {
    return {
      board: member.boardId,
      user: member.userId,
      joinedAt: member.joinedAt,
    };
  }
}
