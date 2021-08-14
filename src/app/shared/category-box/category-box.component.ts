import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-category-box",
  templateUrl: "./category-box.component.html",
  styleUrls: ["./category-box.component.scss"],
})
export class CategoryBoxComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
  @Input("catTxt") inputText = "PassSomething";
  @Input("catDesc") catDesc = "";
  @Input("fromMultiCar") fromMultiCar = false;
  @Input("catImg") catImg = "../../../assets/testingMedia/sample_02.jpeg";
  @Input("inputHeight") inputHeight = "";
  @Input("inputWidth") inputWidth = "";
}
