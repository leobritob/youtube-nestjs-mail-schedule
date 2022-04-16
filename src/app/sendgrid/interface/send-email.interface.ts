interface To {
  email: string;
  name: string;
}

interface Cc {
  email: string;
  name: string;
}

interface Bcc {
  email: string;
  name: string;
}

interface From {
  email: string;
  name: string;
}

interface Personalization {
  to: To[];
  cc?: Cc[];
  bcc?: Bcc[];
  from?: From;
}

interface From2 {
  email: string;
  name: string;
}

interface ReplyTo {
  email: string;
  name: string;
}

interface Content {
  type: string;
  value: string;
}

export interface SendEmailInterface {
  personalizations: Personalization[];
  from: From2;
  reply_to: ReplyTo;
  subject: string;
  content: Content[];
}
