import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapMiniComponent } from './map-mini.component';

describe('MapMiniComponent', () => {
  let component: MapMiniComponent;
  let fixture: ComponentFixture<MapMiniComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapMiniComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapMiniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
