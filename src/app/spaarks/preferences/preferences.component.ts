import { Component, OnInit, NgZone } from "@angular/core";
import { Router } from "@angular/router";
import { AllpurposeserviceService } from "../../allpurposeservice.service";
import { SpaarksService } from "../../spaarks.service";
import { Location } from "@angular/common";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-preferences",
  templateUrl: "./preferences.component.html",
  styleUrls: ["./preferences.component.scss"],
})
export class PreferencesComponent implements OnInit {
  constructor(
    private router: Router,
    private serviceTocall: AllpurposeserviceService,
    private spaarksservice: SpaarksService,
    private location: Location,
    public _zone: MatSnackBar,
    private _zoneone: NgZone
  ) {
    this.isMobileVersion = this.spaarksservice.isMobileVersion;
  }

  isMobileVersion;
  AskLocation = true;
  preferences;
  selectionArray = [];
  btnName = "Next";
  count = 0;
  showNext = false;
  con = 0;
  gunnstwo = [
    {
      id: "retbk1",
      name: "find a job",
      isCat: true,
      subCats: [
        {
          id: "refff57",
          name: "memer",
          isTicked: false,
          isCat: false,
          subCats: [],
        },
        {
          id: "retkbk1",
          name: "jai chand",
          isCat: false,
          subCats: [],
          isTicked: false,
        },
        {
          id: "rejtbk1",
          name: "ux developer",
          isCat: false,
          subCats: [],
          isTicked: false,
        },
        {
          id: "regtbk1",
          name: "full stack",
          isCat: false,
          subCats: [],
          isTicked: false,
        },
      ],
      isTicked: false,
    },
    {
      id: "retbk",
      name: "carpenter",
      isCat: false,
      subCats: [],
      isTicked: false,
    },
    {
      id: "retbk2",
      name: "wood worker",
      isCat: false,
      subCats: [],
      isTicked: false,
    },
    {
      id: "retbk3",
      name: "electrician",
      isCat: false,
      subCats: [],
      isTicked: false,
    },
    {
      id: "retbk4",
      name: "plumber",
      isCat: false,
      subCats: [],
      isTicked: false,
    },
    {
      id: "retbk6",
      name: "bakery",
      isCat: false,
      subCats: [],
      isTicked: false,
    },
    {
      id: "retbk7",
      name: "Catering",
      isCat: false,
      subCats: [],
      isTicked: false,
    },
    {
      id: "retbk8",
      name: "Fruit juice",
      isCat: false,
      subCats: [],
      isTicked: false,
    },
    {
      id: "retbk9",
      name: "Painter",
      isCat: false,
      subCats: [],
      isTicked: false,
    },
    {
      id: "retbk0",
      name: "Repair",
      isCat: true,
      subCats: [
        {
          id: "rrrrrb4457",
          name: "memer",
          isTicked: false,
          isCat: false,
          subCats: [],
        },
        {
          id: "ret1bk1",
          isTicked: false,
          name: "jai chand",
          isCat: false,
          subCats: [],
        },
        {
          id: "rej3bk1",
          isTicked: false,
          name: "ux developer",
          isCat: false,
          subCats: [],
        },
        {
          id: "re6tbk1",
          name: "full stack",
          isCat: false,
          subCats: [],
          isTicked: false,
        },
      ],
      isTicked: false,
    },
    {
      id: "retbk54",
      name: "Flowers",
      isCat: false,
      subCats: [],
      isTicked: false,
    },
    {
      id: "retbk345",
      name: "Gardener",
      isCat: false,
      subCats: [],
      isTicked: false,
    },
    {
      id: "retbk35",
      name: "Photographer",
      isCat: false,
      subCats: [],
      isTicked: false,
    },
    {
      id: "retbwek",
      name: "Fitness/Yoga",
      isCat: true,
      subCats: [],
      isTicked: false,
    },
    {
      id: "retb34k",
      name: "Hire Vehicle",
      isCat: true,
      subCats: [
        {
          id: "retkb4457",
          name: "memer",
          isTicked: false,
          isCat: false,
          subCats: [],
        },
        {
          id: "retkbk7",
          name: "jai chand",
          isCat: false,
          subCats: [],
          isTicked: false,
        },
        {
          id: "rejtbk7",
          name: "ux developer",
          isCat: false,
          subCats: [],
          isTicked: false,
        },
        {
          id: "regtbk7",
          name: "full stack",
          isCat: false,
          subCats: [],
          isTicked: false,
        },
      ],
      isTicked: false,
    },
    {
      id: "re34tbk",
      name: "Handicrafts",
      isCat: false,
      subCats: [],
      isTicked: false,
    },
    {
      id: "r6etbk",
      name: "seller",
      isCat: true,
      subCats: [
        { name: "memer", isTicked: false, isCat: false, subCats: [] },
        {
          id: "retkbk11",
          name: "jai chand",
          isCat: false,
          subCats: [],
          isTicked: false,
        },
        {
          id: "rejtbk11",
          name: "ux developer",
          isCat: false,
          subCats: [],
          isTicked: false,
        },
        {
          id: "regtbk11",
          name: "full stack",
          isCat: false,
          subCats: [],
          isTicked: false,
        },
      ],
      isTicked: false,
    },
    {
      id: "ret55bk",
      name: "announce",
      isCat: false,
      isFeature: true,
      subCats: [],
      isTicked: false,
    },
    {
      id: "re4tbk",
      name: "make friends",
      isCat: false,
      isFeature: true,
      subCats: [],
      isTicked: false,
    },
  ];

  ngOnInit(): void {
    this.preferences = this.serviceTocall.getPreferences();
    this.preferences = this.preferences.sort((first, sec) => {
      var a = first.category.toUpperCase();
      var b = sec.category.toUpperCase();
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    });

    if (!localStorage.getItem("lang")) {
      // this.router.navigateByUrl('/home/language')
      // console.log(this.router.url);
      this.spaarksservice.checkforLocation();
    }
    if (localStorage.getItem("weblocation")) {
      this.AskLocation = false;
    }

    if (
      this.AskLocation == true &&
      localStorage.getItem("lang") &&
      !localStorage.getItem("weblocation")
    ) {
      this.serviceTocall.triggerModal.next({
        type: "locationModal",
        step: "default",
        modal: true,
      });
    }
    let val = localStorage.getItem("weblocation");

    console.log(this.preferences);
    try {
      this.btnName = "Save & continue";
      if (localStorage.getItem("preferences")) {
        this.selectionArray = JSON.parse(localStorage.getItem("preferences"));
        this.preferences.forEach((val, index) => {
          if (val) {
            if (val.categoryId) {
              this.selectionArray.forEach((val2, ind) => {
                if (val.categoryId == val2.categoryId) {
                  val.isTicked = true;
                }
              });
            }
          }
        });
        console.log("selection array", this.selectionArray);

        if (this.selectionArray.length >= 1) {
          console.log(this.selectionArray.length);
          this.showNext = true;
        } else {
          this.showNext = false;
        }
      }
    } catch (err) {}
    try {
      if (localStorage.getItem("weblocation")) {
        this.AskLocation = false;
      }
    } catch (error) {}

    if (localStorage.getItem("preferences")) {
      var checkPref: any = localStorage.getItem("preferences");
      checkPref = JSON.parse(checkPref);
      this.selectionArray = checkPref;
    }

    try {
      if (localStorage.getItem("cookieAccess")) {
        let val = localStorage.getItem("cookieAccess");
        if (val == "true") {
        }
      } else {
        this.CookiePolicy();
      }
    } catch {}
  }

  CookiePolicy() {
    this._zoneone.run((submitMessege) => {
      if (localStorage.getItem("lang")) {
        let language = localStorage.getItem("lang");
        if (language == "hi") {
          this._zone
            .open("ओके करने से आप कुकी पॉलिसी स्वीकार कर रहे हैं.", "Ok", {
              duration: 1000000,
            })
            .afterDismissed()
            .subscribe((succ) => {
              localStorage.setItem("cookieAccess", "true");
            });
        } else if (language == "te") {
          this._zone
            .open(
              "సరే క్లిక్ చేయడం ద్వారా మీరు మా కుకీ పాలసీలను అంగీకరించడానికి అంగీకరిస్తున్నారు.",
              "Ok",
              {
                duration: 1000000,
              }
            )
            .afterDismissed()
            .subscribe((succ) => {
              localStorage.setItem("cookieAccess", "true");
            });
        } else {
          this._zone
            .open(
              "By clicking “OK” you are agreeing to accept our cookie policies.",
              "Ok",
              {
                duration: 1000000,
              }
            )
            .afterDismissed()
            .subscribe((succ) => {
              localStorage.setItem("cookieAccess", "true");
            });
        }
      }
    });
  }

  clickedToLocation() {
    if (this.selectionArray.length == 0) {
      this.spaarksservice.somethingWentWrong("choose at least one preference.");
      return;
    }
    localStorage.setItem("preferences", JSON.stringify(this.selectionArray));
    this.spaarksservice.somethingWentWrong(
      "Your interests are saved successfully."
    );
    this.router.navigateByUrl("home/feed");
  }

  clickedd(eve) {
    //   this.selectionArray = []
    console.log(eve);
    console.log(this.selectionArray.length);

    this.count = this.count + 1; /*  */
    if (this.selectionArray.length == 0) {
      this.selectionArray.push(eve);
    } else {
      this.selectionArray.forEach((val, ind) => {
        if (val.categoryId === eve.categoryId) {
          eve.isTicked = false;
          this.selectionArray.splice(ind, 1);
          // console.log("Arr",this.selectionArray);
          this.con = 1;
        }
      });
      if (this.con == 0) {
        this.selectionArray.push(eve);
        this.con = 0;
      }
      this.con = 0;
      if (this.selectionArray.length >= 1) {
        // console.log(this.selectionArray.length)
        this.showNext = true;
      } else {
        this.showNext = false;
      }
    }

    // if (this.con == 0) {
    //   this.selectionArray.push(eve);
    //   this.con = 0;
    // }
    // this.con = 0;
    if (this.selectionArray.length >= 1) {
      // console.log(this.selectionArray.length)
      this.showNext = true;
    } else {
      this.showNext = false;
    }

    // this.preferences=[...this.preferences,...this.selectionArray];

    // console.log(this.gunnstwo)
    // this.gunnstwo.forEach((val, ind) => {

    //   if (eve.id == val.id) {
    //     console.log('equal')
    //     if (val.isCat == false) {
    //       console.log('not cat')
    //       if (val.isTicked == false) {
    //         console.log('ticked')
    //         val.isTicked = true;
    //         this.count = this.count + 1;
    //         this.selectionArray.push(val);

    //       }
    //     }
    //     else if (val.isCat == true) {
    //       if (val.isTicked == false) {
    //         //append

    //         setTimeout(() => {
    //           val.subCats.forEach((val, ind) => {
    //             this.gunnstwo.splice(ind, 0, val);
    //             // console.log(this.gunnstwo);
    //           })
    //         }, 1000)

    //         console.log(val);
    //         console.log(this.gunnstwo);

    //         if (val.subCats.length > 0) {
    //           this.gunnstwo.forEach((abc, ind) => {
    //             if (val.id == abc.id) {
    //               this.gunnstwo.splice(ind, 1);
    //             }
    //           })
    //         }

    //         console.log(this.gunnstwo);

    //         // setTimeout(() => {

    //         //   this.gunnstwo.splice(ind, 1);
    //         // }, 1000)

    //       } else {
    //         setTimeout(() => {

    //           this.gunnstwo.splice(ind, 1);
    //         }, 1000)
    //       }
    //     }
    //   }

    // })

    // console.log(this.selectionArray);
    // this.spaarksservice.preferencesArr = this.selectionArray;
  }
}
