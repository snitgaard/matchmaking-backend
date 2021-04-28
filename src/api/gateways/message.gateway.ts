import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Inject } from '@nestjs/common';
import {
  IMessageService,
  IMessageServiceProvider,
} from '../../core/primary-ports/message.service.interface';
import { MessageDto } from '../dto/message.dto';
import { Socket } from 'socket.io';
import { IUserService } from '../../core/primary-ports/user.service.interface';

@WebSocketGateway()
export class MessageGateway {
  constructor(
    @Inject(IMessageServiceProvider) private messageService: IMessageService,
    private userService: IUserService,
  ) {}
  @WebSocketServer() server;
  /*@SubscribeMessage('message')
  async handleMessageEvent(
    @MessageBody() message: MessageDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const userMessage = await this.messageService.newMessage(
      message.message,
      message.userClientId,
    );
    this.server.emit('newMessage', userMessage);
  }

  @SubscribeMessage('typing')
  async handleTypingEvent(
    @MessageBody() typing: boolean,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const userClient = await this.messageService.updateTyping(
      typing,
      client.id,
    );
    if (userClient) {
      this.server.emit('userTyping', userClient);
    }
  }

  async handleConnection(client: Socket, ...args: any[]): Promise<any> {
    client.emit('allMessages', this.messageService.getMessages());
    this.server.emit('users', await this.userService.getUsers());
  }

  handleDisconnect(client: any): any {
    return client;
  }*/
}
