import { Pipe, PipeTransform } from '@angular/core';
import { DateTime, Settings } from 'luxon';

@Pipe({
  name: 'time',
  standalone: true,
})
export class TimePipe implements PipeTransform {
  private pluralize(num: number, words: string[]): string {
    const cases = [2, 0, 1, 1, 1, 2];
    return words[
      num % 100 > 4 && num % 100 < 20 ? 2 : cases[Math.min(num % 10, 5)]
    ];
  }

  transform(value: string | null): string | undefined {
    if (value == null) {
      return '';
    }

    Settings.defaultLocale = 'ru';

    const dateTime = DateTime.fromISO(value, { zone: 'utc' }).setZone('local');

    const now = DateTime.now();
    const diff = now.diff(dateTime, ['days', 'hours', 'minutes']).toObject();

    if (!dateTime.isValid) return '';

    const days = diff.days ?? 0;
    const hours = diff.hours ?? 0;

    if (days === 0 && hours === 0) {
      return dateTime.toFormat('HH:mm');
    } else if (days === 0 && hours < 24) {
      const hourWord = this.pluralize(Math.floor(hours), [
        'час',
        'часа',
        'часов',
      ]);
      return `${Math.floor(hours)} ${hourWord} назад`;
    } else if (days > 0 && days <= 5) {
      const dayWord = this.pluralize(Math.floor(days), ['день', 'дня', 'дней']);
      return `${Math.floor(days)} ${dayWord} назад`;
    } else {
      return dateTime.toFormat('d LLLL yyyy');
    }
  }
}
