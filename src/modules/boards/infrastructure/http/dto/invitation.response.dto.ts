import { ApiProperty } from '@nestjs/swagger';

export class InvitationResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  boardId!: string;

  @ApiProperty()
  invitedEmail!: string;

  @ApiProperty()
  invitedByUserId!: string;

  @ApiProperty({ enum: ['pending', 'accepted', 'rejected'] })
  status!: 'pending' | 'accepted' | 'rejected';

  @ApiProperty()
  createdAt!: string;
}
