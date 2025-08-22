import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompraDeMaterial } from './compra-de-material';

describe('CompraDeMaterial', () => {
  let component: CompraDeMaterial;
  let fixture: ComponentFixture<CompraDeMaterial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompraDeMaterial]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompraDeMaterial);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
