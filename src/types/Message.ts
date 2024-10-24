
export type MessageChannel2 = 'web' | 'whatsappcloudapi'

interface WebMessage {
  channel: 'web'
  webClientSenderId: string
}
interface WhatsappCloudApiMessage {
  channel: 'whatsappcloudapi'
  channelIdentityId: string
  from: string
  to: string
}

export interface TextMessage {
  messageType: 'text' | 'file'
  messageContent: string
  files: File[]
}

export interface MessageFile {
  filename: string,
  url: string,
  mimeType: string,
  fileId: string,
  metadata: {
    width: number
    height: number
  }
}

// export interface FileMessage {
//   messageType: 'file'
//   files: File[]
// }

export interface TemplateMessage {
  messageType: 'template'
  extendedMessage: {
    WhatsappCloudApiTemplateMessageObject: {
      templateName : string,
      components: object[],
      language: string,
    }
  },
}

export type NewMessage = TextMessage & (WebMessage | WhatsappCloudApiMessage) |
    (TemplateMessage & WhatsappCloudApiMessage)

interface BaseMessage {
  id: number
  isSentFromSleekflow: boolean
  updatedAt: string
  timestamp: number
  status: 'Read' | 'Sending' | 'Received' | 'Failed' | 'Sent'
}


export type Message = BaseMessage & NewMessage
