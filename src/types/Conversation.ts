


type WebConversation = {
  channel: 'web',
  userIdentityId: string
}

type WhatsappCloudApiConversation = {
  channel: 'whatsappcloudapi'
  userIdentityId: string
  channelIdentityId: string
  lastContactFromCustomers: string
}

export type Conversation = {
  conversationId: string
  name: string
  modifiedAt: string
} & (WebConversation | WhatsappCloudApiConversation)
