import {UserModel} from '../../core/models/user.model';
import { UserMessage } from '../../core/models/user-message.model';

export interface UserDTO {
    users: UserModel[];
    user: UserModel;
    messages: UserMessage[];
}
