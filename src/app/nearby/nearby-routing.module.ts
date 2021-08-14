import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SearchComponent } from "./search/search.component";

const routes: Routes = [
  { path: ":id", pathMatch: "full", component: SearchComponent },
  { path: "", pathMatch: "full", component: SearchComponent },
  { path: "**", component: SearchComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NearbyRouting {}
