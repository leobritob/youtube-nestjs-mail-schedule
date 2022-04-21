import { MailStatusEnum } from '../enum/mail-status.enum';

export class FindAllMailDto {
  dueDateLte: string;
  status: MailStatusEnum;
}
