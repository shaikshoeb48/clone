import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "distancePipe",
  pure: true,
})
export class DistancePipePipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    if (Number(value) > 1000) {
      return Math.floor(Number(value) / 1000) + " Km";
    } else {
      return Math.floor(Number(value)) + " Mts";
    }
  }
}
