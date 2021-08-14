import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaarksmodalComponent } from './spaarksmodal.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

describe('SpaarksmodalComponent', () => {
  let component: SpaarksmodalComponent;
  let fixture: ComponentFixture<SpaarksmodalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SpaarksmodalComponent],
      imports: [RouterTestingModule, HttpClientModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaarksmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
