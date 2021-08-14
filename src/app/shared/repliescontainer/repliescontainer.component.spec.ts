import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepliescontainerComponent } from './repliescontainer.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

describe('RepliescontainerComponent', () => {
  let component: RepliescontainerComponent;
  let fixture: ComponentFixture<RepliescontainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepliescontainerComponent ],
      imports:[RouterTestingModule, HttpClientModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepliescontainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
