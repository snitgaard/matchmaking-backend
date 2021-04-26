import {Injectable} from '@nestjs/common';
import {UserMessage} from '../models/user-message.model';
import {UserModel} from '../models/user.model';
import {InjectRepository} from '@nestjs/typeorm';
import {User} from '../../infrastructure/user.entity';
import {Repository} from 'typeorm';
import {Message} from '../../infrastructure/message.entity';

@Injectable()
export class UserService {
    allMessages: UserMessage[] = [];
    clients: UserModel[] = [];

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Message)
        private messageRepository: Repository<Message>,
    ) {}




}
