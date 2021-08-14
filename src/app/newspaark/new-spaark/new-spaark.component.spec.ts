import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSpaarkComponent } from './new-spaark.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

describe('NewSpaarkComponent', () => {
  let component: NewSpaarkComponent;
  let fixture: ComponentFixture<NewSpaarkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSpaarkComponent ],
      imports:[HttpClientModule,RouterTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSpaarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
