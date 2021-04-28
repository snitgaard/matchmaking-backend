import { Injectable } from '@nestjs/common';
import { IChatService } from '../primary-ports/chat.service.interface';
import { ChatModel } from '../models/chat.model';
import { UserModel } from '../models/user.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from "../../infrastructure/chat.entity";
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
    const messages = await this.chatRepository.find({ relations: ['user']});
    const chatMessages: ChatModel[] = JSON.parse(JSON.stringify(messages));
    return chatMessages;
  }

  async createMessage(messageString: string, senderId: string): Promise<ChatModel> {
    let message: Chat = this.chatRepository.create();
    message.message = messageString;

    message.user = await this.userRepository.findOne({ id: senderId });
    message.date = Date.now();
    message = await this.chatRepository.save(message);

    return {
      message: message.message,
      user: message.user,
      date: message.date,
    };
  }

  async updateTyping(typing: boolean, id: string): Promise<UserModel> {
    const users = await this.userRepository.find();
    const userClients: UserModel[] = JSON.parse(JSON.stringify(users));

    const userClient = await userClients.find((u) => u.id === id);
    if (userClient && userClient.typing !== typing) {
      userClient.typing = typing;
      return userClient;
    }
  }
}
