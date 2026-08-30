import { ApiProperty } from '@nestjs/swagger';

export class BoardMemberResponseDto {
  @ApiProperty()
  userId!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty({ enum: ['owner', 'member'] })
  role!: 'owner' | 'member';
}

export class ListBoardMembersResponseDto {
  @ApiProperty({ type: [BoardMemberResponseDto] })
  members!: BoardMemberResponseDto[];
}
