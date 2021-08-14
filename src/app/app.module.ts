import { BrowserModule } from "@angular/platform-browser";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
// import { SpaarksModule } from './spaarks/spaarks.module';
import { AppRoutingSpaarks } from "./app-routing.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  LocationStrategy,
  HashLocationStrategy,
  PathLocationStrategy,
} from "@angular/common";
import { Injectable, NgZone } from "@angular/core";

import { BarRatingModule } from "node_modules/ngx-bar-rating";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { AuthInterceptor } from "./app-interceptor";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatChipsModule } from "@angular/material/chips";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { DatatransformerPipe } from "./datatransformer.pipe";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { SpaarksService } from "./spaarks.service";
import { SharedModule } from "./shared/shared.module";
import { NgOtpInputModule } from "ng-otp-input";
import { MatBottomSheetModule } from "@angular/material/bottom-sheet";
import { GetstartedgaurdService } from "./getstartedgaurd.service";
import { TermsMobileComponent } from "../app/terms-mobile/terms-mobile.component";

@NgModule({
  declarations: [AppComponent, DatatransformerPipe, TermsMobileComponent],
  exports: [AppComponent, DatatransformerPipe, MatBottomSheetModule],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingSpaarks,
    BrowserAnimationsModule,
    BarRatingModule,
    NgbModule,
    MatExpansionModule,
    MatChipsModule,
    MatAutocompleteModule,
    HttpClientModule,
    MatSnackBarModule,
    SharedModule,
    NgOtpInputModule,
    MatBottomSheetModule,
  ],
  providers: [
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useFactory: function (router: Router, SpaarksService: SpaarksService,HttpClient:HttpClient,MatSnackBar: MatSnackBar,
        NgZone: NgZone,) {
        return new AuthInterceptor(router, SpaarksService,HttpClient,MatSnackBar,NgZone);
      },
      multi: true,
      deps: [Router, SpaarksService,HttpClient],
    },
    GetstartedgaurdService,
  ],

  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {
  // constructor(private readonly router: Router) {
  //   router.events.subscribe(console.log);
  // }
}
