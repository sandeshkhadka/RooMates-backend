import prisma from "../db";

export async function createMessage(msg: ChatMessagePayload) {
  const message = await prisma.chatMessages.create({
    data: {
      message: msg.message,
      sender: msg.sender,
    },
  });

  return message;
}

export async function getRecentMessages() {
  const messages = await prisma.chatMessages.findMany({
    orderBy: {
      timestamp: "desc",
    },
    take: 50,
  });
  return {
    messages: messages.reverse(),
  };
}

export async function deleteMessage(id: string, initiater: string) {
  try {
    const message = await prisma.chatMessages.update({
      data: {
        message: "[Deleted]",
      },
      where: {
        id: id,
        sender: initiater,
      },
    });
    return message;
  } catch (e) {
    console.log(e);
    return false;
  }
}
