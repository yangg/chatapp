


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
  conversationId: number
  lastChannelIdentityId: string,
} & (WebConversation | WhatsappCloudApiConversation)
