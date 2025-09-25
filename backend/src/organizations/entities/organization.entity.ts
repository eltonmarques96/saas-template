import { Exam } from '../../exams/entities/exam.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  title: string;

  @ManyToOne(() => Exam, (exam) => exam.organizations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'organization_id' })
  exam: Exam;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
