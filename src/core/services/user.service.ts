import { Injectable } from '@nestjs/common';
import { UserModel } from '../models/user.model';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../infrastructure/user.entity';
import { Repository } from 'typeorm';
import { IUserService } from '../primary-ports/user.service.interface';

@Injectable()
export class UserService implements IUserService {


  users: UserModel[] = [];
  DEFAULT_RATING: number = 1000;
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}



  async disconnectUser(id: string): Promise<void> {
        await this.userRepository.delete({id: id});
        this.users = this.users.filter((c) => c.id !== id);
    }

  async createUser(id: string, userModel: UserModel): Promise<UserModel> {
    const userDb = await this.userRepository.findOne({
      username: userModel.username,
    });
    if (!userDb) {
      let user = this.userRepository.create();
      user.username = userModel.username;
      user.password = userModel.password;
      user.rating = this.DEFAULT_RATING;
      user.inGame = false;
      user.inQueue = false;
      user.matches = userModel.matches;
      user = await this.userRepository.save(user);
      return {
        id: '' + user.id,
        username: user.username,
        password: user.password,
        rating: user.rating,
        inGame: user.inGame,
        inQueue: user.inQueue,
        matches: user.matches,
      };
    }
    if (userDb.id === id) {
      return {
        id: userDb.id,
        username: userDb.username,
        password: userDb.password,
        rating: userDb.rating,
        inQueue: userDb.inQueue,
        inGame: userDb.inGame,
        matches: userDb.matches,
      };
    } else {
      throw new Error('User already exists');

    }
  }

  async getUsers(): Promise<UserModel[]> {
    const users = await this.userRepository.find();
    const userEntities: UserModel[] = JSON.parse(JSON.stringify(users));
    return userEntities;
  }

  async getUserById(id: string): Promise<UserModel> {
        const userDb = await this.userRepository.findOne({id: id})
        const userModel: UserModel = {
            id: userDb.id,
            username: userDb.username,
            password: userDb.password,
            rating: userDb.rating,
            inQueue: userDb.inQueue,
            inGame: userDb.inGame,
            matches: userDb.matches
        };
        return userModel;
    }



}
