import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from 'src/modules/iam/infrastructure/http/dto/user.response.dto';

export class MyInvitationResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  boardId!: string;

  @ApiProperty()
  boardName!: string;

  @ApiProperty()
  invitedEmail!: string;

  @ApiProperty({ enum: ['pending', 'accepted', 'rejected'] })
  status!: 'pending' | 'accepted' | 'rejected';

  @ApiProperty({ type: UserResponseDto })
  invitedBy!: UserResponseDto;

  @ApiProperty()
  createdAt!: string;
}

export class ListMyInvitationsResponseDto {
  @ApiProperty({ type: [MyInvitationResponseDto] })
  invitations!: MyInvitationResponseDto[];
}
