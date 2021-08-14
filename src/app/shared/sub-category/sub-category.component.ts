import { SpaarksService } from "../../spaarks.service";
import { AllpurposeserviceService } from "../../allpurposeservice.service";
import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
} from "@angular/core";

@Component({
  selector: "app-sub-category",
  templateUrl: "./sub-category.component.html",
  styleUrls: ["./sub-category.component.scss"],
})
export class SubCategoryComponent implements OnInit, OnChanges {
  constructor(
    private allPuroseService: AllpurposeserviceService,
    private spaarkService: SpaarksService
  ) {}

  Question = this.allPuroseService.questions.data;
  finDat;
  imgToshowinFinal = "";
  questionsimagePath = "assets/catsubcatimages/questionsimages/";
  catsimagepath = "assets/catsubcatimages/categoryimages/";
  @Input("catTxt") inputText;
  @Input("catImg") catImg = "../../../assets/testingMedia/sample_05.jpeg";
  @Input("link") link = "Dummy Url";

  @Input("isPrevious") isPrevious = false;

  @Input("prevData") prevData;
  
  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
  }
  ngOnInit(): void {
    this.Question = this.allPuroseService.questions.data;

    // this.finDat = [];
    if (this.prevData) {
      console.log(this.prevData);
      this.Question.forEach((val, ind) => {
        console.log(val);
        if (val) {
          if (val.questionNo == this.prevData.questionNo) {
            this.imgToshowinFinal = this.questionsimagePath + val.image;
            this.finDat = val;
            let catstosearch = [];
            // if(this.prevData.){}
          }
        }
      });

      let selectedCat = undefined;
      if (this.prevData.categoryId != "") {
        let catt = this.allPuroseService.categories;
        catt.forEach((val, ind) => {
          if (val) {
            if (val.categoryId == this.prevData.categoryId) {
              selectedCat = val;
              this.imgToshowinFinal = this.catsimagepath + val.image;
            }
          }
        });
        // this.imgToshowinFinal = this.catsimagepath+
      }

      if (this.prevData.subCategoryId != "") {
        let subcatt = selectedCat;
        console.log(subcatt, "sub");
        if (subcatt.subCategory) {
          if (subcatt.subCategory.length > 0) {
            subcatt.subCategory.forEach((val, ind) => {
              if (val) {
                if (val.subCategoryId == this.prevData.subCategoryId) {
                  this.imgToshowinFinal = this.catsimagepath + val.image;
                }
              }
            });
          }
        }
        // this.imgToshowinFinal = this.catsimagepath+
      }
    }
    if (this.prevData) {
      this.prevData.categoryId = this.prevData.categoryId.toLowerCase();
    }

    console.log(this.prevData);
    console.log(this.Question);
    console.log(this.Question[3].question);

    if (this.spaarkService.quickSpaarkClicked == true) {
      this.spaarkService.quickSpaark = this.prevData;
    }
  }
}
