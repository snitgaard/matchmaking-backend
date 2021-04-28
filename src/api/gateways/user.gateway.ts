import {
  ConnectedSocket,
  MessageBody,
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

@WebSocketGateway()
export class UserGateway {
  constructor(
    @Inject(IUserServiceProvider) private userService: IUserService,
  ) {}

  @WebSocketServer() server;

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
      this.server.emit('clientTyping', userClients);
    }
  }
}
