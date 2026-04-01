import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosEmpresa } from './datos-empresa';

describe('DatosEmpresa', () => {
  let component: DatosEmpresa;
  let fixture: ComponentFixture<DatosEmpresa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosEmpresa]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatosEmpresa);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
