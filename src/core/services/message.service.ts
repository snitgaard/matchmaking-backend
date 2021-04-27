import { Injectable } from '@nestjs/common';
import { IMessageService } from '../primary-ports/message.service.interface';
import { UserMessage } from '../models/user-message.model';
import { UserModel } from '../models/user.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from '../../infrastructure/message.entity';
import { Repository } from 'typeorm';
import { User } from '../../infrastructure/user.entity';

@Injectable()
export class MessageService implements IMessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

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
