import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Grupo, GrupoService } from '../service/grupo-service';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialCadastro, MaterialService } from '../service/material-service';

@Component({
  selector: 'app-cadastro-de-materiais',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule, 
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './cadastro-de-materiais.html',
  styleUrl: './cadastro-de-materiais.css'
})
export class CadastroDeMateriais implements OnInit {

  nome: string = ''
  grupoSelecionado: Grupo | null = null;
  preco: number | null = null;
  quantidadeEmEstoque: number | null = null;
  grupos: Grupo[] = []
  imageUrl: string = 'placeholder.png';
  selectedFile: File | null = null;

  constructor(
    private grupoService: GrupoService,
    private snakbar: MatSnackBar,
    private materialService: MaterialService 
  ) {}

  ngOnInit(): void {
    this.grupoService.getGrupos().subscribe(response => { 
      this.grupos = response
    })
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(meuForm: NgForm): void {
    const dadosMaterial: MaterialCadastro = {
      nome: this.nome,
      grupoId: this.grupoSelecionado!.id,
      preco: this.preco!,
      quantidadeEmEstoque: this.quantidadeEmEstoque!
    };
    this.materialService.postMaterial(dadosMaterial, this.selectedFile).subscribe({
    next: () => {
      console.log('Material e imagem enviados com sucesso!');
      this.openSnackBar();
      meuForm.resetForm();
      this.imageUrl = 'placeholder.png';
      this.selectedFile = null;
    },
  });
    
  }

  openSnackBar() {
    this.snakbar.open('Material cadastrado com sucesso!', 'Fechar', {
      duration: 3000
    });
  }

}
