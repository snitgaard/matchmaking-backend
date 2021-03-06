import { Injectable } from '@nestjs/common';
import { IChatService } from '../primary-ports/chat.service.interface';
import { ChatModel } from '../models/chat.model';
import { UserModel } from '../models/user.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from '../../infrastructure/chat.entity';
import { Repository } from 'typeorm';
import { User } from '../../infrastructure/user.entity';

@Injectable()
export class ChatService implements IChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getMessages(): Promise<ChatModel[]> {
    const messages = await this.chatRepository.find({ relations: ['user'] });
    return JSON.parse(JSON.stringify(messages));
  }

  async createMessage(
    messageString: string,
    userId: string,
  ): Promise<ChatModel> {
    let message: Chat = await this.chatRepository.create();
    message.message = messageString;

    message.user = await this.userRepository.findOne({ id: userId });
    message.date = Date.now();
    message = await this.chatRepository.save(message);

    return {
      message: message.message,
      user: message.user,
      date: message.date,
    };
  }
}
