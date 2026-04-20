import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Author {
  @ApiProperty({ description: 'Unique identifier (UUID)', example: 'uuid-v4' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Author full name', example: 'J.R.R. Tolkien' })
  @Column({ nullable: false })
  name: string;

  @ApiProperty({
    description: 'OpenLibrary author page URL',
    example: 'https://openlibrary.org/authors/OL26320A',
    nullable: true,
  })
  @Column({ nullable: true })
  pageUrl: string;

  @ApiProperty({
    description: 'Author photo URL',
    nullable: true,
  })
  @Column({ nullable: true })
  photoUrl: string;

  @ApiProperty({ description: 'Creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;
}
