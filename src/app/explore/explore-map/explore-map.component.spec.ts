import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreMapComponent } from './explore-map.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

describe('ExploreMapComponent', () => {
  let component: ExploreMapComponent;
  let fixture: ComponentFixture<ExploreMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExploreMapComponent ],
      imports:[HttpClientModule, RouterTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExploreMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
