import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaarkscardComponent } from './spaarkscard.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { HttpClientModule } from '@angular/common/http';

describe('SpaarkscardComponent', () => {
  let component: SpaarkscardComponent;
  let fixture: ComponentFixture<SpaarkscardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SpaarkscardComponent],
      imports: [RouterTestingModule, MatBottomSheetModule, MatSnackBarModule, MatMenuModule, HttpClientModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaarkscardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
