import { ChatModel } from '../models/chat.model';
import { UserModel } from '../models/user.model';

export const IChatServiceProvider = 'IChatServiceProvider';
export interface IChatService {
  createMessage(messageString: string, senderId: string): Promise<ChatModel>;

  getMessages(): Promise<ChatModel[]>;

  updateTyping(typing: boolean, id: string): Promise<UserModel>;
}
