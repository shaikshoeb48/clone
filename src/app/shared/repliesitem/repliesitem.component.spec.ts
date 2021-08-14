import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepliesitemComponent } from './repliesitem.component';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';

describe('RepliesitemComponent', () => {
  let component: RepliesitemComponent;
  let fixture: ComponentFixture<RepliesitemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepliesitemComponent ],
      imports:[MatMenuModule, RouterTestingModule, HttpClientModule, MatBottomSheetModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepliesitemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
