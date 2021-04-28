import {Injectable} from '@nestjs/common';
import {UserMessage} from '../models/user-message.model';
import {UserModel} from '../models/user.model';
import {InjectRepository} from '@nestjs/typeorm';
import {User} from '../../infrastructure/user.entity';
import {Repository} from 'typeorm';
import {Message} from '../../infrastructure/message.entity';
import {IUserService} from '../primary-ports/user.service.interface';

@Injectable()
export class UserService implements IUserService {
    allMessages: UserMessage[] = [];
    users: UserModel[] = [];

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Message)
        private messageRepository: Repository<Message>,
    ) {
    }

    async getMessages(): Promise<UserMessage[]> {
        const messages = await this.messageRepository.find();
        const userMessages: UserMessage[] = JSON.parse(JSON.stringify(messages));
        return userMessages;
    }

    async newMessage(
      messageString: string,
      senderId: string,
    ): Promise<UserMessage> {
        let message: Message = this.messageRepository.create();
        message.message = messageString;

        message.user = await this.userRepository.findOne({ id: senderId });
        message.date = Date.now();
        message = await this.messageRepository.save(message);

        return {
            message: message.message,
            user: message.user,
            date: message.date,
        };
    }
    async delete(id: string): Promise<void> {
        await this.userRepository.delete({id: id});
        this.users = this.users.filter((c) => c.id !== id);
    }

    async createUser(id: string, userModel: UserModel): Promise<UserModel>
    {
        const userDb = await this.userRepository.findOne({
            username: userModel.username,
        });
        if(!userDb)
        {
            let user = this.userRepository.create();
            user.id = id;
            user.username = userModel.username;
            user.password = userModel.password;
            user.inGame = userModel.inGame;
            user.inQueue = userModel.inQueue;
            user.rating = userModel.rating;
            user.matches = userModel.matches;
            user.messages = userModel.messages;
            user = await this.userRepository.save(user);
            return {
                id: '' + user.id,
                username: user.username,
                password: user.password,
                rating: user.rating,
                inGame: user.inGame,
                inQueue: user.inQueue,
                matches: user.matches,
                messages: user.messages
            };
        }
        if(userDb.id === id)
        {
            return {
                id: userDb.id,
                username: userDb.username,
                password: userDb.password,
                rating: userDb.rating,
                inQueue: userDb.inQueue,
                inGame: userDb.inGame,
                messages: userDb.messages,
                matches: userDb.matches
            };
        }
        else {
            throw new Error('User already exists')
        }
    }

    async getUsers(): Promise<UserModel[]> {
        const users = await this.userRepository.find();
        const userEntities: UserModel[] = JSON.parse(JSON.stringify(users));

        return userEntities;
    }

    async updateTyping(typing: boolean, id: string): Promise<UserModel> {
        const users = await this.userRepository.find();
        const userEntities: UserModel[] = JSON.parse(JSON.stringify(users));

        const userEntitie = await userEntities.find((c) => c.id === id);
        if(userEntitie && userEntitie.typing !== typing) {
            userEntitie.typing = typing;
            return userEntitie
        }
    }
    async getUser(id: string): Promise<UserModel> {
        const userDb = await this.userRepository.findOne({id: id})
        const userModel: UserModel = {
            id: userDb.id,
            username: userDb.username,
            password: userDb.password,
            rating: userDb.rating,
            inQueue: userDb.inQueue,
            inGame: userDb.inGame,
            messages: userDb.messages,
            matches: userDb.matches
        };
        return userModel;
    }
}
