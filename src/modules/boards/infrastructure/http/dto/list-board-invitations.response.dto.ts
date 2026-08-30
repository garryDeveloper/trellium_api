import { ApiProperty } from '@nestjs/swagger';
import { InvitationResponseDto } from './invitation.response.dto';

export class ListBoardInvitationsResponseDto {
  @ApiProperty({ type: [InvitationResponseDto] })
  invitations!: InvitationResponseDto[];
}
