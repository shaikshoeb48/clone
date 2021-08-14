import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketCatComponent } from './market-cat.component';

describe('MarketCatComponent', () => {
  let component: MarketCatComponent;
  let fixture: ComponentFixture<MarketCatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketCatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketCatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
