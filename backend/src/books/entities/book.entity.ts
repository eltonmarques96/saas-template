import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Author } from '@/authors/entities/author.entity';
import { Category } from '@/categories/entities/category.entity';

@Entity()
export class Book {
  @ApiProperty({ description: 'Unique identifier (UUID)', example: 'uuid-v4' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Book title', example: 'The Lord of the Rings' })
  @Column({ nullable: false })
  title: string;

  @ApiProperty({ description: 'Book cover image URL', nullable: true })
  @Column({ nullable: true })
  coverUrl: string;

  @ApiProperty({ description: 'Book synopsis / description', nullable: true })
  @Column({ type: 'text', nullable: true })
  synopsis: string;

  @ApiProperty({ description: 'Number of pages', nullable: true })
  @Column({ type: 'integer', nullable: true })
  pages: number;

  @ApiProperty({ description: 'Original published date', nullable: true })
  @Column({ type: 'date', nullable: true })
  publishedDate: Date;

  @ApiProperty({ description: 'Publisher name', nullable: true })
  @Column({ nullable: true })
  publisher: string;

  @ApiProperty({ description: 'ISBN identifier (unique)', nullable: true })
  @Column({ nullable: true, unique: true })
  isbn: string;

  @ApiProperty({
    description: 'Book page URL (e.g. OpenLibrary)',
    nullable: true,
  })
  @Column({ nullable: true })
  siteUrl: string;

  @ApiProperty({ description: 'OpenLibrary work ID (unique)', nullable: true })
  @Column({ nullable: true, unique: true })
  openLibraryId: string;

  @ApiProperty({
    description: 'Number of times the book was viewed',
    default: 0,
  })
  @Column({ type: 'integer', default: 0 })
  viewCount: number;

  @ApiProperty({ description: 'Author foreign key UUID' })
  @Column({ nullable: true })
  authorId: string;

  @ApiProperty({ description: 'Book author', type: () => Author })
  @ManyToOne(() => Author, { nullable: true, eager: false })
  @JoinColumn({ name: 'authorId' })
  author: Author;

  @ApiProperty({ description: 'Book categories', type: () => [Category] })
  @ManyToMany(() => Category, { eager: false, cascade: true })
  @JoinTable({ name: 'book_categories' })
  categories: Category[];

  @ApiProperty({ description: 'Creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;
}
