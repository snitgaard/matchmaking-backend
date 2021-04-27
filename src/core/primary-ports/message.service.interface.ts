import { UserMessage } from '../models/user-message.model';
import { UserModel } from '../models/user.model';

export const IMessageServiceProvider = 'IMessageServiceProvider';
export interface IMessageService {
  newMessage(messageString: string, senderId: string): Promise<UserMessage>;

  getMessages(): Promise<UserMessage[]>;

  updateTyping(typing: boolean, id: string): Promise<UserModel>;
}
