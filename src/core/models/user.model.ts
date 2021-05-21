import { Chat } from '../../infrastructure/chat.entity';
import { Match } from '../../infrastructure/match.entity';
import { MatchResult } from '../../infrastructure/match-result.entity';

export interface UserModel {
  id: string;
  username: string;
  password: string;
  rating: number;
  inGame?: boolean;
  inQueue?: boolean;
  messages?: Chat[];
  matchResults?: MatchResult[];
  typing?: boolean;
  isActive?: boolean;
  lobbyLeader?: boolean;
}
