import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapCardComponent } from './map-card.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

describe('MapCardComponent', () => {
  let component: MapCardComponent;
  let fixture: ComponentFixture<MapCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapCardComponent ],
      imports:[RouterTestingModule, HttpClientModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
