import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "sliceName",
  pure: true,
})
export class SliceNamePipe implements PipeTransform {
  transform(data: any, bigName?: any): any {
    if (bigName) {
      console.log(bigName);
      if (data.length < 15) {
        return data;
      } else {
        // console.log(data)
        data = data.slice(0, 15) + "...";
        // console.log(data);
        return data;
      }
    }

    if (data.length < 10) {
      return data;
    } else {
      // console.log(data)
      data = data.slice(0, 9) + "...";
      // console.log(data);
      return data;
    }
    return null;
  }
}
