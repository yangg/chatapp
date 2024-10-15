


type WebConversation = {
  lastMessageChannel: 'web',
  userProfile: {
    webClient: {
      webClientUUID: string
    }
  }
}

type WhatsappCloudApiConversation = {
  lastMessageChannel: 'whatsappcloudapi'
  userProfile: {
    whatsappCloudApiUser: {
      userIdentityId: string
    }
  }
}

export type Conversation = {
  conversationId: string
  lastChannelIdentityId: string
  modifiedAt: string
} & (WebConversation | WhatsappCloudApiConversation)
