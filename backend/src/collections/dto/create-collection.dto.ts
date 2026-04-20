import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCollectionDto {
  @ApiProperty({ description: 'Collection name', example: 'My Favorites' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
