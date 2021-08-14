import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomNavBarComponent } from './bottom-nav-bar.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('BottomNavBarComponent', () => {
  let component: BottomNavBarComponent;
  let fixture: ComponentFixture<BottomNavBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BottomNavBarComponent ],
      imports:[RouterTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BottomNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
