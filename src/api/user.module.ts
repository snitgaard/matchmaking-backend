import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from '../infrastructure/user.entity';
import {UserGateway} from './gateways/user.gateway';
import {IUserServiceProvider} from '../core/primary-ports/user.service.interface';
import {UserService} from '../core/services/user.service';


@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers:
        [
            UserGateway,
            {
                provide: IUserServiceProvider,
                useClass: UserService
            }
        ],
})
export class UserModule {}
