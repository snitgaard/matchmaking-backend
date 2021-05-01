import {Injectable} from '@nestjs/common';
import {UserModel} from '../models/user.model';
import {InjectRepository} from '@nestjs/typeorm';
import {User} from '../../infrastructure/user.entity';
import {Repository} from 'typeorm';
import {IUserService} from '../primary-ports/user.service.interface';
import {ChatModel} from '../models/chat.model';
import {Chat} from '../../infrastructure/chat.entity';

@Injectable()
export class UserService implements IUserService {
    users: UserModel[] = [];
    DEFAULT_RATING = 1000;

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Chat)
        private chatRepository: Repository<Chat>,
    ) {
    }

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
        if (userDb.username === userModel.username && userDb.password === userModel.password) {
          console.log(userDb)
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

    async login(id: string, userModel: UserModel): Promise<UserModel> {
        const userDb = await this.userRepository.findOne({
            username: userModel.username,
        });
        if (userDb.username === userModel.username && userDb.password === userModel.password) {
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
        const userDb = await this.userRepository.findOne({id: id});
        const userModel: UserModel = {
            id: userDb.id,
            username: userDb.username,
            password: userDb.password,
            rating: userDb.rating,
            inQueue: userDb.inQueue,
            inGame: userDb.inGame,
            matches: userDb.matches,
        };
        return userModel;
    }

    async getMessages(): Promise<ChatModel[]> {
        const messages = await this.chatRepository.find({relations: ['user']});
        const chatMessages: ChatModel[] = JSON.parse(JSON.stringify(messages));
        return chatMessages;
    }
}
