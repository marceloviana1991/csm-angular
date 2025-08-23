import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendaDeMaterial } from './venda-de-material';

describe('VendaDeMaterial', () => {
  let component: VendaDeMaterial;
  let fixture: ComponentFixture<VendaDeMaterial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendaDeMaterial]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendaDeMaterial);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
