import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerProfContainerComponent } from './seller-prof-container.component';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

describe('SellerProfContainerComponent', () => {
  let component: SellerProfContainerComponent;
  let fixture: ComponentFixture<SellerProfContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellerProfContainerComponent ],
      imports:[RouterTestingModule, HttpClientModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellerProfContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
