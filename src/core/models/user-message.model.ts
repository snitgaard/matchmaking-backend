import {User} from '../../infrastructure/user.entity';

export interface UserMessage {
    message: string;
    user: User;
    date: number;
}
