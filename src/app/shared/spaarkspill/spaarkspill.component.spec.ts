import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaarkspillComponent } from './spaarkspill.component';

describe('SpaarkspillComponent', () => {
  let component: SpaarkspillComponent;
  let fixture: ComponentFixture<SpaarkspillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpaarkspillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaarkspillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
 
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
