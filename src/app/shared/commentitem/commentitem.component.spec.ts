import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentitemComponent } from './commentitem.component';
import { MatMenuModule } from '@angular/material/menu';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';

describe('CommentitemComponent', () => {
  let component: CommentitemComponent;
  let fixture: ComponentFixture<CommentitemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentitemComponent ],
      imports:[MatMenuModule, RouterTestingModule, HttpClientModule, MatBottomSheetModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentitemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
