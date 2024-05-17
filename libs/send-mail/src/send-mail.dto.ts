export class SendMailDto {
  receiver: string;
  subject: string;
  content: string;
  html?: string;
}
