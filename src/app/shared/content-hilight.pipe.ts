import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "contentHilight",
  pure: true,
})
export class ContentHilightPipe implements PipeTransform {
  transform(value: any, wordtohighlight: any): any {
    let stringContent = value.toLowerCase();
    let searchInput = wordtohighlight.toLowerCase();

    //let heightOfContent = stringContent.length;

    let findString = stringContent;

    if (stringContent.indexOf(searchInput) == -1) {
      findString = "";
    } else if (stringContent.indexOf(searchInput) < 3) {
      findString = stringContent.slice(0, 30) + "...";
    } else {
      /*else if(stringContent.indexOf(searchInput) > stringContent.length-3){
      findString = stringContent.slice(stringContent.length-30,stringContent.length)+ '...'
    }*/
      let contentIndex = stringContent.indexOf(searchInput);
      let endcontentIndex = stringContent.indexOf(" ", contentIndex);
      findString = stringContent.slice(contentIndex, endcontentIndex);
    }
    /*if(stringContent.indexOf(wordtohighlight)<5){
      findString = stringContent.substring(0,stringContent.indexOf(wordtohighlight)+wordtohighlight.length)+'....'
    }else{
      findString = '...'+stringContent.substring(stringContent.indexOf(wordtohighlight),stringContent.indexOf(wordtohighlight)+wordtohighlight.length)+'....'

    }*/
    // let gun =

    return findString;
  }
}
