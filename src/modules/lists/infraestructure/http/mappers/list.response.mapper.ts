import { List } from '../../../domain/entities/list.entity';
import { ListResponseDto } from '../dto/list.response.dto';

export class ListResponseMapper {
  static toResponseDto(list: List): ListResponseDto {
    return {
      id: list.id,
      name: list.name,
      boardId: list.boardId,
      status: list.status,
      position: list.position,
      createdAt: list.createdAt.toISOString(),
    };
  }
}
