import { City } from '../../cities/entities/city.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class State {
  @PrimaryColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  nome: string;

  @Column({ nullable: false, unique: true })
  sigla: string;

  @Column({ default: true })
  enabled: boolean;

  @CreateDateColumn()
  data_registro: string;

  @UpdateDateColumn()
  data_atualizacao: string;

  @OneToMany(() => City, (city) => city.state, { cascade: true })
  cities: City[];
}
