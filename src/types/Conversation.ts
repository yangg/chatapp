


type WebConversation = {
  channel: 'web',
  webClientSenderId: string
}

type WhatsappCloudApiConversation = {
  channel: 'whatsappcloudapi'
  userIdentityId: string
}

export type Conversation = {
  conversationId: string
  title: string
  channelIdentityId: string
  modifiedAt: string
} & (WebConversation | WhatsappCloudApiConversation)
