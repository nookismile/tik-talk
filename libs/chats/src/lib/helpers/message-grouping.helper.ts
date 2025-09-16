import { Message, MessageGroup } from '@tt/data-access/chats';

export class MessageGroupingHelper {
  static groupMessagesByDate(messages: Message[]): MessageGroup[] {
    if (!messages || messages.length === 0) {
      return [];
    }

   const sortedMessages = [...messages].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    const groups: MessageGroup[] = [];
    let currentGroup: MessageGroup | null = null;

    sortedMessages.forEach((message) => {
      const messageDate = new Date(message.createdAt);
      const messageDateString = messageDate.toDateString(); 

      if (
        !currentGroup ||
        currentGroup.date.toDateString() !== messageDateString
      ) {
        currentGroup = {
          date: messageDate,
          messages: [],
        };
        groups.push(currentGroup);
      }

      currentGroup.messages.push(message);
    });

    return groups;
  }

  static isSameDay(date1: Date, date2: Date): boolean {
    return date1.toDateString() === date2.toDateString();
  }

  static getRelativeDateString(date: Date): string {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const messageDate = new Date(date);

    if (this.isSameDay(messageDate, today)) {
      return 'Сегодня';
    } else if (this.isSameDay(messageDate, yesterday)) {
      return 'Вчера';
    } else {
      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
  }
}
