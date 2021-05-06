import {UserModel} from '../models/user.model';
import { ChatModel } from '../models/chat.model';

export const IUserServiceProvider = 'IUserServiceProvider';

export interface IUserService {
    createUser(id: string, userModel: UserModel): Promise<UserModel>

    getUsers(): Promise<UserModel[]>;

    getUserById(id: string): Promise<UserModel>;

    disconnectUser(id: string): Promise<void>;

    getMessages(): Promise<ChatModel[]>;

    updateUser(id: string, user: UserModel): Promise<UserModel>

    login(id: string, userModel: UserModel): Promise<UserModel>
}
