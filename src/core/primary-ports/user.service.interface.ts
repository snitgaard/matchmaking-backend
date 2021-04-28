import {UserModel} from '../models/user.model';
import { UserMessage } from '../models/user-message.model';

export const IUserServiceProvider = 'IUserServiceProvider';

export interface IUserService {
    createUser(id: string, userModel: UserModel): Promise<UserModel>

    getUsers(): Promise<UserModel[]>;

    getUser(id: string): Promise<UserModel>;

    updateTyping(typing: boolean, id: string): Promise<UserModel>;

    newMessage(messageString: string, senderId: string): Promise<UserMessage>;

    getMessages(): Promise<UserMessage[]>;

    delete(id: string): Promise<void>;
}
