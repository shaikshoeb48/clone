import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortNumber'
})
export class ShortNumberPipe implements PipeTransform {

  transform(number: number, args?: any): any {
    
    if(number<1000){return number}
    else{
      let abs = Math.abs(number);
      const rounder = Math.pow(10, 1);
      let reduced = abs / 1000;
      reduced = Math.round(reduced * rounder) / rounder;
      abs = reduced>=1? reduced: abs;
      return  abs + 'K';
    } 
  }
}
