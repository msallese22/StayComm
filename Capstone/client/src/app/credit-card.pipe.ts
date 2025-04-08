import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'creditCard'
})
export class CreditCardPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) {
      return '';
    }
    const trimmedValue = value.replace(/\s/g, '');
    const parts: string[] = [];
    for (let i = 0; i < trimmedValue.length; i += 4) {
      parts.push(trimmedValue.slice(i, i + 4));
    }
    return parts.join(' ');
  }

}
