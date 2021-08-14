import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VariableselectboxComponent } from './variableselectbox.component';

describe('VariableselectboxComponent', () => {
  let component: VariableselectboxComponent;
  let fixture: ComponentFixture<VariableselectboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VariableselectboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VariableselectboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
