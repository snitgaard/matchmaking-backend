import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Inject } from '@nestjs/common';
import {
  IChatService,
  IChatServiceProvider,
} from '../../core/primary-ports/chat.service.interface';
import { ChatDto } from '../dto/chat.dto';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class ChatGateway {
  constructor(
    @Inject(IChatServiceProvider) private chatService: IChatService,
  ) {}
  @WebSocketServer() server;
  @SubscribeMessage('create-message')
  async createMessageEvent(@MessageBody() chatDto: ChatDto): Promise<void> {
    const chatMessage = await this.chatService.createMessage(
      chatDto.message,
      chatDto.userId,
    );
    this.server.emit('new-message', chatMessage);
  }

  @SubscribeMessage('typing')
  async checkTypingEvent(
    @MessageBody() typing: boolean,
    @ConnectedSocket() chatSocket: Socket,
  ): Promise<void> {
    const user = await this.chatService.updateTyping(typing, chatSocket.id);
    if (user) {
      this.server.emit('userTyping', user);
    }
  }

  @SubscribeMessage('getAllMessages')
  async getAllMessagesEvent(
    @ConnectedSocket() chatSocket: Socket,
  ): Promise<void> {
    try {
      const messages = await this.chatService.getMessages();
      chatSocket.emit('messages', messages);
    } catch (e) {
      console.log('Could not fetch messages');
    }
  }
}
