import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import {Inject} from '@nestjs/common';
import {IUserService, IUserServiceProvider} from '../../core/primary-ports/user.service.interface';

@WebSocketGateway()
export class UserGateway {
    constructor(@Inject(IUserServiceProvider) private userService: IUserService) {
    }

    @WebSocketServer() server;
}
