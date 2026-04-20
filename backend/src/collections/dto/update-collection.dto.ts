import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCollectionDto {
  @ApiPropertyOptional({
    description: 'Collection name',
    example: 'Updated Name',
  })
  @IsOptional()
  @IsString()
  name?: string;
}
