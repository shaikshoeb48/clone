import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'datatransformer',
  pure: true
})
export class DatatransformerPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
