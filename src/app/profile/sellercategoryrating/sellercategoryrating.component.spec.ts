import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellercategoryratingComponent } from './sellercategoryrating.component';

describe('SellercategoryratingComponent', () => {
  let component: SellercategoryratingComponent;
  let fixture: ComponentFixture<SellercategoryratingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellercategoryratingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellercategoryratingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
