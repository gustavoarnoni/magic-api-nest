import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly users: { id: number; username: string; password: string; role: string }[] = [];
  private idCounter = 1;

  async findOne(username: string) {
    return this.users.find(user => user.username === username);
  }

  async createUser(username: string, password: string, role: string = 'user') {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: this.idCounter++,
      username,
      password: hashedPassword,
      role, // Salva a role corretamente
    };
    this.users.push(newUser);
    return { id: newUser.id, username: newUser.username, role: newUser.role };
  }
}
