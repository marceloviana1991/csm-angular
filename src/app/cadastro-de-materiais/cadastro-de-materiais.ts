import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Grupo, GrupoService } from '../service/grupo-service';
import { MatSelectModule } from '@angular/material/select';

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
export class CadastroDeMateriais implements OnInit  {

  nome: string = ''
  grupoSelecionado: Grupo | null = null;
  preco: number | null = null;
  quantidadeEmEstoque: number | null = null;
  grupos: Grupo[] = []

  constructor(
    private grupoService: GrupoService
  ) {}

  onSubmit(meuForm: NgForm): void {
    console.log('Dados:', meuForm.value);
    meuForm.reset();
  }

  ngOnInit(): void {
    this.grupoService.getGrupos().subscribe(response => { 
      this.grupos = response
    })
  }

}
