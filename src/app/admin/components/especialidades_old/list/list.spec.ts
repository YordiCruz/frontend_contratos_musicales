import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListCategorias } from '../../categorias/list/list';


describe('List', () => {
  let component: ListCategorias;
  let fixture: ComponentFixture<ListCategorias>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListCategorias]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListCategorias);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
