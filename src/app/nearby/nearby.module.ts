import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";
import { SearchComponent } from "./search/search.component";
import { DirectivesModule } from "../directives/directives.module";

@NgModule({
  declarations: [SearchComponent],
  imports: [
    SharedModule,
    CommonModule,
    CommonModule,
    FormsModule,
    DirectivesModule,
  ],
  exports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NearbyModule {}
