import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriasEventos } from './categorias-eventos';

describe('CategoriasEventos', () => {
  let component: CategoriasEventos;
  let fixture: ComponentFixture<CategoriasEventos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriasEventos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriasEventos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
