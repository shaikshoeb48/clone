import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "urlify",
  pure: true
})
export class UrlifyPipe implements PipeTransform {
  transform(text: any): any {
    const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
    return text.replace(urlRegex, function (url) {
      return '<a href="' + url + '" target="_blank">' + url + "</a>";
    });
  }
}
