import { Pipe, PipeTransform } from "@angular/core";
import * as moment from "moment";

@Pipe({
  name: "timeformat",
  pure: true,
})
export class TimeformatPipe implements PipeTransform {
  transform(sm, ...args: unknown[]): unknown {
    // console.log(sm);
    let date1 = new Date();
    let a = moment(date1).format("YYYY-MM-DD HH:mm");
    let b = moment(sm);
    let neg_mins = b.diff(date1, "minutes");
    let positive_mins = Math.abs(neg_mins);
    let minutesDiff = positive_mins;
    //  console.log(minutesDiff)
    let finRemString;
    let minsCnt;
    let data = minutesDiff;

    let dateTime = moment(date1).format("YYYY-MM-DD HH:mm:ss");
    let hourCnt;
    let temp;

    //console.log(minutesDiff,"Created")

    finRemString = minutesDiff / 60 / 24;

    if (minutesDiff < 1440) {
      var da = moment(sm, "HH:mm:ss").format("LT");
      return da;
    } else {
      let dat = new Date(sm);
      dat.toDateString();
      //console.log(dat,"converted")
      var month = dat.toLocaleString("default", { month: "long" });
      finRemString = finRemString.toFixed(0);

      temp =
        month.substring(0, 3) + " " + dat.getDate() + " " + dat.getFullYear();
      return temp;
    }
  }
}
