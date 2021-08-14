import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  ViewChild,
  ElementRef,
  Renderer2,
} from "@angular/core";
import * as _ from "lodash";

@Component({
  selector: "app-variableselectbox",
  templateUrl: "./variableselectbox.component.html",
  styleUrls: ["./variableselectbox.component.scss"],
})
export class VariableselectboxComponent implements OnInit {
  constructor(private renderer: Renderer2) {}

  @ViewChild("reff") reff: ElementRef;

  @Input("textt") textt;
  // ;={isTicked:false,name:'find a job'};
  imageUrl: any;

  colorsArr = [
    "#FFCF86",
    "#6CB28E",
    "#8E97FC",
    "#4E5567",
    "#FA6E5A",
    "#f84b6b",
  ];
  sizesArrl = [
    { width: "157px", height: "130px" },
    { width: "127px", height: "129px" },
    { width: "126px", height: "165px" },
    { width: "60px", height: "22px" },
    { width: "76px", height: "140px" },
  ];

  sizesArr = [
    { width: "157", height: "110" },
    { width: "127", height: "139" },
    { width: "126", height: "165" },
    { width: "60", height: "122" },
    { width: "76", height: "104" },
  ];
  selectedClr = undefined;
  selectedSize = undefined;
  @Output("clickedVarbl") clickedVarbl = new EventEmitter();
  
  ngOnInit(): void {
    // console.log("heyyyyyyyyy",  this.textt);
    this.selectedClr = _.sample([...this.colorsArr]);
    this.selectedSize = _.sample([...this.sizesArr]);
    // console.log(this.selectedSize);
    // console.log(this.selectedClr)
    this.imageUrl =
      "../../../assets/catsubcatimages/categoryimages/" + this.textt.dat.image;
  }

  clicked(eve) {
    eve.isTicked = true;
    this.clickedVarbl.emit(eve);
    if (eve.isTag == false) {
      // this.clickedVarbl.emit({sub:eve.subCat,ind:this.textt.ind});
      // this.renderer.addClass(this.reff.nativeElement,'swing')
    }
  }
}
