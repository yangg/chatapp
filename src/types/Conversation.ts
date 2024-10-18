


type WebConversation = {
  channel: 'web',
  userIdentityId: string
}

type WhatsappCloudApiConversation = {
  channel: 'whatsappcloudapi'
  userIdentityId: string
  channelIdentityId: string
}

export type Conversation = {
  conversationId: string
  title: string
  modifiedAt: string
} & (WebConversation | WhatsappCloudApiConversation)
