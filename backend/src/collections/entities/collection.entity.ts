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
import { User } from '@/users/entities/user.entity';
import { Book } from '@/books/entities/book.entity';

@Entity()
export class Collection {
  @ApiProperty({ description: 'Unique identifier (UUID)', example: 'uuid-v4' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Collection name', example: 'My Favorites' })
  @Column({ nullable: false })
  name: string;

  @ApiProperty({ description: 'Owner user FK UUID' })
  @Column({ nullable: false })
  userId: string;

  @ApiProperty({ description: 'Collection owner', type: () => User })
  @ManyToOne(() => User, { nullable: false, eager: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiProperty({ description: 'Books in this collection', type: () => [Book] })
  @ManyToMany(() => Book, { eager: false, cascade: true })
  @JoinTable({ name: 'collection_books' })
  books: Book[];

  @ApiProperty({ description: 'Creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;
}
