import { Injectable, NgZone } from "@angular/core";
import { Router } from "@angular/router";
import {
  HttpInterceptor,
  HttpErrorResponse,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpHeaders,
  HttpClient,
} from "@angular/common/http";
import { Observable, throwError, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { AllpurposeserviceService } from "./allpurposeservice.service";
import { ReportService } from "./report.service";
import { environment } from "src/environments/environment";
import { SpaarksService } from "./spaarks.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private spaarks: SpaarksService,
    private http: HttpClient,
    public _zone: MatSnackBar,
    private _zoneone: NgZone
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let port;
    try {
      let urlSegments = req.url.split("/");
      let host = urlSegments[2].toString();
      port = parseInt(host.substr(host.length - 4));
    } catch {}

    if (port != 5443) {
      // console.log(req);
      // console.log(req)
      // req.url.split('https://api.spaarksweb.com').join('http://192.168.0.254:3010');
      // console.log(req)
      let optionss;

      optionss = {
        headers: new HttpHeaders({ lang: localStorage.getItem("language") }),
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwMjY2MThlMTA5OGFhNTk5NTI0Nzg1OCIsImlhdCI6MTYxMzEzMzMyMiwiZXhwIjoxNjIwOTA5MzIyfQ.hhW9cEoKVNbpjphHoATKyQq-pImjfTopRzeCwwaLiGE",
      };
      var isLoggedin = false;
      var authReq1 = null;
      var authReq2 = null;

      if (localStorage.getItem("iJAIa")) {
        if (localStorage.getItem("iJAIa") == environment.ijaia) {
          isLoggedin = false;
        } else if (localStorage.getItem("iJAIa") == environment.ijaiaahut) {
          isLoggedin = true;
        }
      }

      if (isLoggedin) {
        if (localStorage.getItem("id")) {
          console.log("i have id");
          var name = localStorage.getItem("name");
          if (name == undefined) return;
          authReq1 = req.clone({
            withCredentials: true,
          });

          return next
            .handle(authReq1)
            .pipe(catchError((x) => this.handleAuthError(x)));
        } else {
          // console.log("no id , push to logout");
        }
      } else {
        // console.log("i cameeeeeeeeee");
        authReq2 = req.clone({});
        return next
          .handle(authReq2)
          .pipe(catchError((x) => this.handleAuthError(x)));
      }
    } else {
      return next.handle(req);
    }
  }
  private logout() {
    var userId = localStorage.getItem("id");
    this.http
      .get(environment.baseUrl + "/api/v2.0/auth/logout/" + userId, {})
      .subscribe(
        (abc) => {
          // this.router.navigateByUrl("/home/getstarted")
          // this.chat.disconnect_xmpp();
        },
        (err) => {
          console.log(err);
          // if (err.status == 401) {
          //   this.router.navigateByUrl('/home/getstarted');
          // };
        }
      );
    this.router.navigateByUrl("/home/feed").then(() => {
      window.location.reload();
    });

    var lang = localStorage.getItem("lang");
    var preferences = localStorage.getItem("preferences");
    var weblocation = localStorage.getItem("weblocation");
    var locationfrom = localStorage.getItem("locationfrom");
    var alreadyvisited = localStorage.getItem("alreadyvisited");
    var isfirstlocation = localStorage.getItem("isfirstlocation");
    var cookieAccess = localStorage.getItem("cookieAccess");
    localStorage.clear();

    if (locationfrom != null) {
      localStorage.setItem("locationfrom", locationfrom);
    }
    if (alreadyvisited != null) {
      localStorage.setItem("alreadyvisited", alreadyvisited);
    }
    if (isfirstlocation != null) {
      localStorage.setItem("isfirstlocation", isfirstlocation);
    }

    if (preferences != null) {
      localStorage.setItem("preferences", preferences);
    }

    if (lang != null) {
      localStorage.setItem("lang", lang);
    }

    if (weblocation != null) {
      localStorage.setItem("weblocation", weblocation);
    }

    if (cookieAccess != null) {
      localStorage.setItem("cookieAccess", cookieAccess);
    }
  }
  
  private handleAuthError(err: HttpErrorResponse): Observable<any> {
    if (err) {
      // this.ErrorHandleResponse(err);
      if (err.status == 401) {
        // console.log("its 401 kick him");
        window.location.reload();

        this.logout();
      }
      if (err.status == 409) {
        if (err.error.message == "Please login to access this feature") {
          
          try{
            this.spaarks.somethingWentWrong(
                  "Your session has been expired,Please login!"
                );
  
          }
          catch(err)
          {
            console.log(err);
          }
         
          setTimeout(() => {
            this.logout();
           
          }, 3000);
        }
      }
      if (err.error.isBadContent == true) {
        // console.log("badContent");
      }
      return throwError(err);
    }
    //  console.log(err,err.headers);
    // let currentUrl = this.router.url;
    //  console.log(this.spaarks.routeToexplore);
    // console.log(currentUrl);
    // console.log(document.URL);
    // if (err.status == 400) {
    //  this.spaarks.reqErrorSubj.next(err.error);
    //   return err.error;
    // }

    // if (err.status == 401 || err.status == 409) {
    // //  if(err){
    // //   this.spaarks.reqErrorSubj.next(err.error);
    // //   console.log("yesrrrrr")
    // //  }
    //   // if (err.error.message == "Please login to access this feature") {
    //   //   console.log("We ahve to loggggg")
    //   //   // window.location.reload();

    //   //   this.router.navigateByUrl("/home/feed").then(() => {
    //   //     window.location.reload();
    //   //   });
    //   //   return
    //   // }
    //   if (err.error.isBadContent == true) {
    //     console.log("badContent");
    //     window.alert(err.error.message);
    //     return;
    //   }
    //   console.log(err.error.message);

    //   if (err.status == 401
    //   ) {
    //     console.log(err);
    //     // if(err.error)
    //     if (err.error.logout) {
    //       console.log("heyyyyyyyyyy");

    //       this.router.navigateByUrl("/home/feed").then(() => {
    //         window.location.reload();
    //       });

    //       var lang = localStorage.getItem("lang");
    //       var preferences = localStorage.getItem("preferences");
    //       var weblocation = localStorage.getItem("weblocation");
    //       var locationfrom = localStorage.getItem("locationfrom");
    //       var alreadyvisited = localStorage.getItem("alreadyvisited");
    //       var isfirstlocation = localStorage.getItem("isfirstlocation");
    //       var cookieAccess = localStorage.getItem("cookieAccess");
    //       localStorage.clear();

    //       if (locationfrom != null) {
    //         localStorage.setItem("locationfrom", locationfrom);
    //       }
    //       if (alreadyvisited != null) {
    //         localStorage.setItem("alreadyvisited", alreadyvisited);
    //       }
    //       if (isfirstlocation != null) {
    //         localStorage.setItem("isfirstlocation", isfirstlocation);
    //       }

    //       if (preferences != null) {
    //         localStorage.setItem("preferences", preferences);
    //       }

    //       if (lang != null) {
    //         localStorage.setItem("lang", lang);
    //       }

    //       if (weblocation != null) {
    //         localStorage.setItem("weblocation", weblocation);
    //       }

    //       if (cookieAccess != null) {
    //         localStorage.setItem("cookieAccess", cookieAccess);
    //       }

    //     }
    //     console.log("unauthorized!");
    //     var lang = localStorage.getItem("lang");
    //     var preferences = localStorage.getItem("preferences");
    //     var weblocation = localStorage.getItem("weblocation");
    //     var locationfrom = localStorage.getItem("locationfrom");
    //     var alreadyvisited = localStorage.getItem("alreadyvisited");
    //     var isfirstlocation = localStorage.getItem("isfirstlocation");
    //     var cookieAccess = localStorage.getItem("cookieAccess");
    //     localStorage.clear();
    //     if (locationfrom != null) {
    //       localStorage.setItem("locationfrom", locationfrom);
    //     }
    //     if (alreadyvisited != null) {
    //       localStorage.setItem("alreadyvisited", alreadyvisited);
    //     }
    //     if (isfirstlocation != null) {
    //       localStorage.setItem("isfirstlocation", isfirstlocation);
    //     }

    //     if (preferences != null) {
    //       localStorage.setItem("preferences", preferences);
    //     }

    //     if (lang != null) {
    //       localStorage.setItem("lang", lang);
    //     }

    //     if (weblocation != null) {
    //       localStorage.setItem("weblocation", weblocation);
    //     }

    //     if (cookieAccess != null) {
    //       localStorage.setItem("cookieAccess", cookieAccess);
    //     }
    //     try {
    //       this.spaarks.clearCookie();
    //     } catch { }
    //     //call logout function here, inorder to escape from unauthorized and loading loop

    //     try {
    //       // this.http.get(environment.base+'cleartoken').subscribe((suc)=>{
    //       // console.log(suc);
    //       // })
    //     } catch { }
    //   } else {
    //   }
    //   return throwError(err);
    // }
  }
  /*  */

  // private ErrorHandleResponse(err: HttpErrorResponse): Observable<any> {
  //   if(err){
  //     console.log(err);
  //     return err.error;
  //   }
  // }
}
