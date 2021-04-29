import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
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
export class UserGateway implements OnGatewayConnection  {
  constructor(@Inject(IUserServiceProvider) private userService: IUserService,) {}

  @WebSocketServer() server;

  @SubscribeMessage('create-user')
  async createUserEvent(
    @MessageBody() userModel: UserModel,
    @ConnectedSocket() userSocket: Socket,
  ): Promise<void> {
    try {
      const user = await this.userService.createUser(userSocket.id, userModel);
      const users = await this.userService.getUsers();
      const userDTO: UserDTO = {
        users: users,
        user: user
      };
      userSocket.emit('userDTO', userDTO);
      this.server.emit('users', users);
    } catch (e) {
      console.log('Could not create user');
    }
  }
  @SubscribeMessage('getAllUsers')
  async getAllUsersEvent(@ConnectedSocket() userSocket: Socket): Promise<void> {
    try {
      const users = await this.userService.getUsers();
      userSocket.emit('users', users);
    } catch (e) {
      console.log('Could not fetch users ');
    }
  }

  async handleConnection(userSocket: Socket, ...args: any[]): Promise<any> {
    this.server.emit('users', await this.userService.getUsers());
  }
/*
  async handleDisconnect(userSocket: Socket): Promise<any> {
    await this.userService.disconnectUser(userSocket.id);
    this.server.emit('users', await this.userService.getUsers());
    console.log('users disconnect:', userSocket.id);
  }
  */

}
