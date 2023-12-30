type ChatMessageType = {
  id: string;
  message: string;
  sender: string;
};
type ChatMessagePayload = Omit<ChatMessageType, "id">;
