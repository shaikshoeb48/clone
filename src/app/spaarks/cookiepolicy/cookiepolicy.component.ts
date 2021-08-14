import { Component, OnInit, Output, EventEmitter, NgZone } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-cookiepolicy",
  templateUrl: "./cookiepolicy.component.html",
  styleUrls: ["./cookiepolicy.component.scss"],
})
export class CookiepolicyComponent implements OnInit {
  constructor(public _zone: MatSnackBar, private _zoneone: NgZone) {}

  ngOnInit(): void {}

  @Output("clickedok") clickedok = new EventEmitter();

  clickedOk() {
    this.clickedok.emit({ ok: "clicked" });
  }
}
