
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

export type NewMessage = {
  messageType?: 'text' | 'file' | 'template'
  messageContent: string
} & (WebMessage | WhatsappCloudApiMessage)

interface BaseMessage {
  id: number
  isSentFromSleekflow: boolean
  updatedAt: string
  timestamp: number
  status: 'Read' | 'Sending' | 'Received' | 'Failed'
}


export type Message = BaseMessage & NewMessage & (WebMessage | WhatsappCloudApiMessage)
