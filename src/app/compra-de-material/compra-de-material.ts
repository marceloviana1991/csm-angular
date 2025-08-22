import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { Material, MaterialService } from '../service/material-service';
import { Grupo, GrupoService } from '../service/grupo-service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-compra-de-material',
  imports: [
    FormsModule,
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule,
    MatButtonModule,
    CommonModule,
    MatCardModule
  ],
  templateUrl: './compra-de-material.html',
  styleUrl: './compra-de-material.css'
})
export class CompraDeMaterial {

  @ViewChild('form') form!: NgForm;

  grupos: Grupo[] = []
  materiais: Material[] = []

  materialSelecionado: Material | null = null;
  imagemDoMaterialSelecionado: SafeUrl | null = null;
  objectUrl: string | null = null;

  quantidade: number = 1;

  constructor(
    private grupoService: GrupoService,
    private materialService: MaterialService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.grupoService.getGrupos().subscribe( grupos => {
      this.grupos = grupos;
    })
  }

  onGrupoSelecionado(event: MatSelectChange) {
    const grupoId = event.value;
    this.materialService.getMateriaisByGrupo(grupoId).subscribe( materiais => {
      this.materiais = materiais;
      this.limparRecursosDaImagem();
    })
  }

  onMaterialSelecionado(event: MatSelectChange) {
    const materialId = event.value.id
    this.materialService.getImagemByMaterial(materialId).subscribe( imageBlob => {
      this.limparRecursosDaImagem();
      const objectURL = URL.createObjectURL(imageBlob);
      this.imagemDoMaterialSelecionado = this.sanitizer.bypassSecurityTrustUrl(objectURL);
    })
    this.materialSelecionado = event.value;
  }

  private limparRecursosDaImagem(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
    }
    this.imagemDoMaterialSelecionado = null;
    this.objectUrl = null;
  }

  onSubmit(ngForm: NgForm) {
    
    // Implementar

    this.form.resetForm();
    this.quantidade = 1;
    this.materiais = [];
    this.materialSelecionado = null;
    this.limparRecursosDaImagem();
  }

}
