import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdicaoDeMateriais } from './edicao-de-materiais';

describe('EdicaoDeMateriais', () => {
  let component: EdicaoDeMateriais;
  let fixture: ComponentFixture<EdicaoDeMateriais>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EdicaoDeMateriais]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EdicaoDeMateriais);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
