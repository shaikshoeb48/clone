import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerprofileComponent } from './sellerprofile.component';
import { RouterTestingModule } from "@angular/router/testing";
import { MatMenuModule } from '@angular/material/menu';


describe('SellerprofileComponent', () => {
  let component: SellerprofileComponent;
  let fixture: ComponentFixture<SellerprofileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellerprofileComponent ],
      imports: [RouterTestingModule, MatMenuModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellerprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
