import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroDeMateriais } from './cadastro-de-materiais';

describe('CadastroDeMateriais', () => {
  let component: CadastroDeMateriais;
  let fixture: ComponentFixture<CadastroDeMateriais>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroDeMateriais]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroDeMateriais);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
