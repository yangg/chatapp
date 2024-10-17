


type WebConversation = {
  lastMessageChannel: 'web',
  webClientSenderId: string
}

type WhatsappCloudApiConversation = {
  lastMessageChannel: 'whatsappcloudapi'
  userIdentityId: string
}

export type Conversation = {
  conversationId: string
  title: string
  channelIdentityId: string
  modifiedAt: string
} & (WebConversation | WhatsappCloudApiConversation)
