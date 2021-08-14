import { Pipe, PipeTransform } from '@angular/core';
import { HindiService } from './hindi.service';
import { TeluguService } from './telugu.service';

@Pipe({
  name: 'featureText',
  pure: true
})
export class FeatureTextPipe implements PipeTransform {

  langvalue = 'en';
  constructor(private hindi: HindiService, private telugu: TeluguService) {
    if (localStorage.getItem('lang')) {
      this.langvalue = localStorage.getItem('lang')
    }
  }

  transform(data: string, lang?: string): string {

    // this.langvalue = localStorage.getItem('lang')
    if (localStorage.getItem('lang')) {
      this.langvalue = localStorage.getItem('lang')
    }
    //console.log('data is '+data);
    //console.log('lang is '+this.langvalue);

    if (this.langvalue == 'en') {

      return data;
    }

    else if (this.langvalue == 'te') {
      let jai = this.telugu.langs[data];
      // console.log(jai,"language data");
      if (jai != undefined && jai != '') {
        // console.log(jai,"language ");

        return this.telugu.langs[data];
      }
      else {
        return data
      }

    }
    else {

      // if(data){
      //   if(data.includes('days')){
      //     return data.replace('days',this.hindi.langs['days']);
      //   }
      //   else if(data.includes('day')){
      //     return data.replace('day',this.hindi.langs['day']);
      //   }
      //   else if(data.includes('hrs')){
      //     return data.replace('hrs',this.hindi.langs['hrs']);
      //   }
      //   else if(data.includes('mins')){
      //     return data.replace('mins',this.hindi.langs['mins']);
      //   }
      //   else{
      let jai = this.hindi.langs[data];
      // console.log(jai,"language data");
      if (jai != undefined && jai != '') {
        // console.log(jai,"language ");

        return this.hindi.langs[data];
      }
      else {
        return data
      }
      // }

      // }
      //     }else{return data}
      // }
    }
  }
}