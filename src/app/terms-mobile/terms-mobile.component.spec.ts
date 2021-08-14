import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsMobileComponent } from './terms-mobile.component';

describe('TermsMobileComponent', () => {
  let component: TermsMobileComponent;
  let fixture: ComponentFixture<TermsMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermsMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
