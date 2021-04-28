import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection, OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Inject } from '@nestjs/common';
import {
  IUserService,
  IUserServiceProvider,
} from '../../core/primary-ports/user.service.interface';
import {UserModel} from '../../core/models/user.model';
import {UserDTO} from '../dto/user.dto';
import {Socket} from 'socket.io';
import { MessageDto } from '../dto/message.dto';

@WebSocketGateway()
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect  {
  constructor(@Inject(IUserServiceProvider) private userService: IUserService,) {}

  @WebSocketServer() server;

  @SubscribeMessage('message')
  async handleMessageEvent(
    @MessageBody() message: MessageDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const userMessage = await this.userService.newMessage(
      message.message,
      message.userClientId,
    );
    this.server.emit('newMessage', userMessage);
  }

  @SubscribeMessage('user')
  async handleUserEvent(
      @MessageBody() userModel: UserModel,
      @ConnectedSocket() user: Socket,
  ): Promise<void> {
    console.log('hello')
    try {
      console.log('hello')
      const userClient = await this.userService.createUser(user.id, userModel);
      const userClients = await this.userService.getUsers();
      const userDTO: UserDTO = {
        users: userClients,
        messages: await this.userService.getMessages(),
        user: userClient
      };
      user.emit('userDTO', userDTO);
      this.server.emit('users', userClients)

    } catch(e)
    {
      console.log("Couldnt create")
    }
  }
  @SubscribeMessage('welcomeUser')
  async handleWelcomeEvent(
      @ConnectedSocket() user: Socket,
  ): Promise<void> {
    try {
      const userClients = await this.userService.getUsers();
      user.emit('users', userClients)

    } catch(e)
    {
      console.log("Couldnt fetch")
    }
  }

  @SubscribeMessage('typing')
  async handleTypingEvent(
    @MessageBody() typing: boolean,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    console.log('typing', typing);
    const userClients = await this.userService.updateTyping(typing, client.id);
    if(userClients) {
      this.server.emit('userTyping', userClients);
    }
  }
  async handleConnection(user: Socket, ...args: any[]): Promise<any> {
    user.emit('allMessages', this.userService.getMessages());
    this.server.emit('users', await this.userService.getUsers());
  }

  async handleDisconnect(user: Socket): Promise<any> {
    await this.userService.delete(user.id);
    this.server.emit('users', await this.userService.getUsers());
    console.log('users disconnect:', user.id);
  }
}
