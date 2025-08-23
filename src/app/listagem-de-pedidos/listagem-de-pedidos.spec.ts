import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListagemDePedidos } from './listagem-de-pedidos';

describe('ListagemDePedidos', () => {
  let component: ListagemDePedidos;
  let fixture: ComponentFixture<ListagemDePedidos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListagemDePedidos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListagemDePedidos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
