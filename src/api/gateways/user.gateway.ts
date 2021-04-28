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
import { UserModel } from '../../core/models/user.model';
import { UserDTO } from '../dto/user.dto';
import { Socket } from 'socket.io';

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
    try {
      console.log('hello1');
      const userClient = await this.userService.createUser(user.id, userModel);
      console.log('hello2');
      const userClients = await this.userService.getUsers();
      console.log('hello3');
      const userDTO: UserDTO = {
        users: userClients,
        user: userClient,
      };
      console.log('hello4');
      user.emit('userDTO', userDTO);
      this.server.emit('users', userClients);
    } catch (e) {
      console.log('Couldnt create');
    }
  }
  @SubscribeMessage('welcomeUser')
  async handleWelcomeEvent(@ConnectedSocket() user: Socket): Promise<void> {
    try {
      const userClients = await this.userService.getUsers();
      user.emit('users', userClients);
    } catch (e) {
      console.log('Couldnt fetch');
    }
  }
}
