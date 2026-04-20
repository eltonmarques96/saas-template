import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Category {
  @ApiProperty({ description: 'Unique identifier (UUID)', example: 'uuid-v4' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Category name (unique)', example: 'Fantasy' })
  @Column({ nullable: false, unique: true })
  name: string;

  @ApiProperty({
    description: 'OpenLibrary subject page URL',
    nullable: true,
  })
  @Column({ nullable: true })
  pageUrl: string;

  @ApiProperty({ description: 'Creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;
}
