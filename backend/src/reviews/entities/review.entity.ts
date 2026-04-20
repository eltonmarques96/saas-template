import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  Check,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@/users/entities/user.entity';
import { Book } from '@/books/entities/book.entity';

@Entity()
@Unique(['userId', 'bookId'])
@Check(`"stars" >= 1 AND "stars" <= 5`)
export class Review {
  @ApiProperty({ description: 'Unique identifier (UUID)', example: 'uuid-v4' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Star rating 1-5', minimum: 1, maximum: 5 })
  @Column({ type: 'integer', nullable: false })
  stars: number;

  @ApiProperty({ description: 'Optional text comment', nullable: true })
  @Column({ type: 'text', nullable: true })
  comment: string;

  @ApiProperty({ description: 'Reviewer user FK UUID' })
  @Column({ nullable: false })
  userId: string;

  @ApiProperty({ description: 'Reviewed book FK UUID' })
  @Column({ nullable: false })
  bookId: string;

  @ApiProperty({ description: 'Reviewer user', type: () => User })
  @ManyToOne(() => User, { nullable: false, eager: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiProperty({ description: 'Reviewed book', type: () => Book })
  @ManyToOne(() => Book, { nullable: false, eager: false })
  @JoinColumn({ name: 'bookId' })
  book: Book;

  @ApiProperty({ description: 'Creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;
}
