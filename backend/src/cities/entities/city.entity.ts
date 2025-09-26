import { State } from '@/states/entities/state.entity';
import { User } from '@/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class City {
  @PrimaryColumn()
  id: number;

  @Column({ nullable: false })
  nome: string;

  @Column({ default: true })
  ativo: boolean;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @ManyToOne(() => State, (state) => state.cities, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'state_id' })
  state: State;

  @Column()
  state_id: number;

  @OneToMany(() => User, (usuario) => usuario, { cascade: true })
  users: User[];
}
