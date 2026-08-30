import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TransferOwnershipRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  newOwnerId!: string;
}
