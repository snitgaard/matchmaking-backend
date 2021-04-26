import {Message} from '../../infrastructure/message.entity';
import {Match} from './match.model';

export interface UserModel{
    id: string;
    username: string;
    password: string;
    rating: number;
    inGame: boolean;
    inQueue: boolean;
    messages?: Message[];
    matches?: Match[];
    typing?: boolean
}
