import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopbarmobileComponent } from './topbarmobile.component';

describe('TopbarmobileComponent', () => {
  let component: TopbarmobileComponent;
  let fixture: ComponentFixture<TopbarmobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopbarmobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopbarmobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
