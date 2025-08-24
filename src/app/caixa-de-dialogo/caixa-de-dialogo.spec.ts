import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaixaDeDialogo } from './caixa-de-dialogo';

describe('CaixaDeDialogo', () => {
  let component: CaixaDeDialogo;
  let fixture: ComponentFixture<CaixaDeDialogo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaixaDeDialogo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaixaDeDialogo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
