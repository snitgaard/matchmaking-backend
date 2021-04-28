import {User} from '../../infrastructure/user.entity';

export interface ChatModel {
    message: string;
    user: User;
    date: number;
}
