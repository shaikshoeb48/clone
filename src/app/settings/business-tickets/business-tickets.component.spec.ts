import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessTicketsComponent } from './business-tickets.component';

describe('BusinessTicketsComponent', () => {
  let component: BusinessTicketsComponent;
  let fixture: ComponentFixture<BusinessTicketsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessTicketsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
