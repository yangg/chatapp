
export interface Message {
id: number;
content: string;
sender: 'user' | 'bot';
senderName: string;
timestamp: Date;
}