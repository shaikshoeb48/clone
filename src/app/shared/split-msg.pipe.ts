import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'splitMsg',
  pure: true
})
export class SplitMsgPipe implements PipeTransform {

  
  transform(text: string, by: string, index: number = 1) {
    let arr = text.split(by); 
    return arr[index]
  }

}
