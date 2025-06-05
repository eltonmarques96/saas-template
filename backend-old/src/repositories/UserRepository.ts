import AppDataSource from '../data-source';
import { User } from '../database/entities/User';

const repo = AppDataSource.getRepository(User);

export class UserRepository {
  static findByEmail(email: string) {
    return repo.findOneBy({ email });
  }

  static async create(data: Partial<User>) {
    const user = repo.create(data);
    return await repo.save(user);
  }

  static async save(user: User) {
    return await repo.save(user);
  }
}
