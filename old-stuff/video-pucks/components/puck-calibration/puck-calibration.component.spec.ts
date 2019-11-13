import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PuckCalibrationComponent } from './puck-calibration.component';

describe('PuckCalibrationComponent', () => {
  let component: PuckCalibrationComponent;
  let fixture: ComponentFixture<PuckCalibrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PuckCalibrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PuckCalibrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
