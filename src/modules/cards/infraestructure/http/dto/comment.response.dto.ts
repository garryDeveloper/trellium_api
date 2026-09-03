import { ApiProperty } from '@nestjs/swagger';

export class CommentAuthorDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  email!: string;
}

export class CommentResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  body!: string;

  @ApiProperty()
  cardId!: string;

  @ApiProperty({ type: CommentAuthorDto })
  author!: CommentAuthorDto;

  @ApiProperty()
  createdAt!: string;
}

export class ListCommentsResponseDto {
  @ApiProperty({ type: [CommentResponseDto] })
  comments!: CommentResponseDto[];
}
