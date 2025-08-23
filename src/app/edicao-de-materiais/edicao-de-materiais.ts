import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Grupo, GrupoService } from '../service/grupo-service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { Material, MaterialEdicao, MaterialService } from '../service/material-service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edicao-de-materiais',
  imports: [
    FormsModule,
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './edicao-de-materiais.html',
  styleUrl: './edicao-de-materiais.css'
})
export class EdicaoDeMateriais implements OnInit {

  @ViewChild('form') form!: NgForm;
  nome: string = ''
  preco: number | null = null 
  quantidadeEmEstoque: number | null = null 

  grupos: Grupo[] = []
  materiais: Material[] = []
  imagemDoMaterialSelecionado: SafeUrl | null = null;
  objectUrl: string | null = null;
  arquivoSelecionado: File | null = null;
  materialSelecionado: Material | null = null;

  constructor(
    private grupoService: GrupoService,
    private materialService: MaterialService,
    private sanitizer: DomSanitizer,
    private snakbar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.grupoService.getGrupos().subscribe( grupos => {
      this.grupos = grupos;
    })
  }

  onGrupoSelecionado(event: MatSelectChange) {
    const grupoId = event.value;
    this.materialService.getMateriaisByGrupoCompra(grupoId).subscribe( materiais => {
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
    this.nome = this.materialSelecionado!.nome;
    this.preco = this.materialSelecionado!.preco;
    this.quantidadeEmEstoque = this.materialSelecionado!.quantidadeEmEstoque;
  }

  private limparRecursosDaImagem(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
    }
    this.imagemDoMaterialSelecionado = null;
    this.objectUrl = null;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.arquivoSelecionado = input.files[0];
      if (this.materialSelecionado) {
        console.log(this.materialSelecionado)
        this.materialService.putImagemByMaterial(this.materialSelecionado.id, this.arquivoSelecionado).subscribe({
          next: () => {
            this.form.resetForm();
            this.materiais = [];
            this.materialSelecionado = null;
            this.arquivoSelecionado = null;
            this.limparRecursosDaImagem();
            this.openSnackBar();
          }
        })
      }
    }
  }

  onSubmit(ngForm: NgForm) {
    const materialEdicao: MaterialEdicao = {
      nome: this.nome,
      preco: this.preco!,
      quantidadeEmEstoque: this.quantidadeEmEstoque!
    }
    const id = this.materialSelecionado?.id
    if (id) {
      this.materialService.putMaterial(id, materialEdicao).subscribe({
        next: () => {
            this.form.resetForm();
            this.materiais = [];
            this.materialSelecionado = null;
            this.arquivoSelecionado = null;
            this.limparRecursosDaImagem();
            this.openSnackBar();
          }
      })
    }
  }

  openSnackBar() {
    this.snakbar.open('Material atualizado com sucesso!', 'Fechar', {
      duration: 3000
    });
  }

  

}
