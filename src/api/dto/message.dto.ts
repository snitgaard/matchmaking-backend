import { MessageService } from "../../core/services/message.service";

export interface MessageDto {
  messages: MessageService[];
  message: MessageService;
}
