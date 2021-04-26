import {UserModel} from '../../core/models/user.model';

export interface UserDTO {
    users: UserModel[];
    user: UserModel;
}
