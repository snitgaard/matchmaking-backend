import { Chat } from '../../infrastructure/chat.entity';
import { Match } from '../../infrastructure/match.entity';

export interface UserModel {
  id: string;
  username: string;
  password: string;
  rating: number;
  inGame?: boolean;
  inQueue?: boolean;
  messages?: Chat[];
  matches?: Match[];
  typing?: boolean;
  isActive?: boolean;
}
