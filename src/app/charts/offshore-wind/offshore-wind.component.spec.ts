import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OffshoreWindComponent } from './offshore-wind.component';

describe('OffshoreWindComponent', () => {
  let component: OffshoreWindComponent;
  let fixture: ComponentFixture<OffshoreWindComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OffshoreWindComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OffshoreWindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
