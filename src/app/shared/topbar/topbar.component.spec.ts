import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopbarComponent } from './topbar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatMenuModule } from '@angular/material/menu';

import { By } from '@angular/platform-browser';
import { SpaarksService } from 'src/app/spaarks.service';

fdescribe('TopbarComponent', () => {
  let component: TopbarComponent;
  let fixture: ComponentFixture<TopbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TopbarComponent],
      imports: [RouterTestingModule, HttpClientModule, MatBottomSheetModule, MatMenuModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it("should use the arraytoOpenBottomsheet from the service", () => {


    component.openSettings();

    const spaark = fixture.debugElement.injector.get(SpaarksService);
    fixture.detectChanges();
    expect(spaark.arraytoOpenBottomsheet).toEqual(component.listtorender);
  })

});
