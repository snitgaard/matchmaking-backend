import {UserModel} from '../models/user.model';

export const IUserServiceProvider = 'IUserServiceProvider';

export interface IUserService {
    createUser(id: string, userModel: UserModel): Promise<UserModel>

    getUsers(): Promise<UserModel[]>;

    getUser(id: string): Promise<UserModel>;
}
