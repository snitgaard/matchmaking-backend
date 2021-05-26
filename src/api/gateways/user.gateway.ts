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
  IUserService,
  IUserServiceProvider,
} from '../../core/primary-ports/user.service.interface';
import { UserModel } from '../../core/models/user.model';
import { UserDTO } from '../dto/user.dto';
import { Socket } from 'socket.io';
import { ConnectUserDto } from '../dto/connect-user.dto';

@WebSocketGateway()
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server;

  constructor(
    @Inject(IUserServiceProvider) private userService: IUserService,
  ) {}

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
        user: user,
      };
      userSocket.emit('userDTO', userDTO);
      this.server.emit('users', users);
    } catch (e) {
      console.log('Could not create user');
    }
  }

  @SubscribeMessage('connect-user')
  async handleJoinChatEvent(
    @MessageBody() connectUserDto: ConnectUserDto,
    @ConnectedSocket() userSocket: Socket,
  ): Promise<void> {
    try {
      console.log('Hello1');
      const userModel: UserModel = JSON.parse(JSON.stringify(connectUserDto));
      const user = await this.userService.login(userSocket.id, userModel);
      console.log('Hello2');
      const authUser: UserModel = {
        id: user.id,
        username: user.username,
        password: user.password,
        rating: user.rating,
        inQueue: user.inQueue,
        inGame: user.inGame,
        isActive: user.isActive,
        lobbyLeader: user.lobbyLeader,
      };
      console.log(authUser);
      userSocket.emit('iamconnected', authUser);
      this.server.emit('users', await this.userService.getUsers());
    } catch (e) {
      console.log('Incorrect information');
    }
  }

  @SubscribeMessage('updateUser')
  async handleUpdateUserEvent(
    @MessageBody() userModel: UserModel,
    @ConnectedSocket() userSocket: Socket,
  ): Promise<void> {
    try {
      const userUpdate = await this.userService.updateUser(
        userModel.id,
        userModel,
      );
      const users = await this.userService.getUsers();
      const userDTO: UserDTO = {
        users: users,
        user: userUpdate,
      };
      userSocket.emit('userDTO', userDTO);
      this.server.emit('users', users);
    } catch (e) {
      console.log('Error', e);
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
    console.log('Client connect:', userSocket.id);
    this.server.emit('users', await this.userService.getUsers());
  }

  async handleDisconnect(userSocket: Socket): Promise<any> {
    await this.userService.disconnectUser(userSocket.id);
    this.server.emit('users', await this.userService.getUsers());
    console.log('users disconnect:', userSocket.id);
  }
}
