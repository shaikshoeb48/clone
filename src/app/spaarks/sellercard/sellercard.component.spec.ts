import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellercardComponent } from './sellercard.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

describe('SellercardComponent', () => {
  let component: SellercardComponent;
  let fixture: ComponentFixture<SellercardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellercardComponent ],
      imports:[RouterTestingModule, HttpClientModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellercardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
