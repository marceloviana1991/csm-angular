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
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface ItemDoPedido {
  material: Material;
  quantidade: number;
}

@Component({
  selector: 'app-compra-de-material',
  imports: [
    FormsModule,
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule,
    MatButtonModule,
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule
  ],
  templateUrl: './compra-de-material.html',
  styleUrl: './compra-de-material.css'
})
export class CompraDeMaterial {

  @ViewChild('form') form!: NgForm;

  grupos: Grupo[] = []
  materiais: Material[] = []
  itensDoPedido: ItemDoPedido[] = []

  materialSelecionado: Material | null = null;
  imagemDoMaterialSelecionado: SafeUrl | null = null;
  objectUrl: string | null = null;

  quantidade: number = 1;

  colunasDaTabelaDeItens: string[] = ['Nome', 'Quantidade', 'Valor total', 'Remover']

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

    if (!this.materialSelecionado) {
        this.openSnackBar('Selecione um material válido.');
        return;
    }

    const itemDoPedidoExistente = this.itensDoPedido.find(item => item.material.id === this.materialSelecionado!.id);
    
    if (itemDoPedidoExistente) {
      itemDoPedidoExistente.quantidade += this.quantidade;

      if (this.materialSelecionado.quantidadeEmEstoque < itemDoPedidoExistente.quantidade) {
        this.openSnackBar('Quantidade indiponível!');
        itemDoPedidoExistente.quantidade -= this.quantidade;
        return;
      }
      
    } else {
      if (this.materialSelecionado.quantidadeEmEstoque < this.quantidade) {
        this.openSnackBar('Quantidade indiponível!');
        return;
      }
      
      const itemDoPedido: ItemDoPedido = {
        material: this.materialSelecionado,
        quantidade: this.quantidade
      };
      
      this.itensDoPedido.push(itemDoPedido);
    }

    this.itensDoPedido = [...this.itensDoPedido];

    this.form.resetForm();
    this.quantidade = 1;
    this.materiais = [];
    this.materialSelecionado = null;
    this.limparRecursosDaImagem();
}

  removerItem(itemParaRemover: ItemDoPedido) {
    this.itensDoPedido = this.itensDoPedido.filter(item => item !== itemParaRemover);
    this.form.resetForm();
    this.quantidade = 1;
    this.materiais = [];
    this.materialSelecionado = null;
    this.limparRecursosDaImagem();
  }

  finalizarPedido() {
    this.itensDoPedido = []
    this.form.resetForm();
    this.quantidade = 1;
    this.materiais = [];
    this.materialSelecionado = null;
    this.limparRecursosDaImagem();
    this.openSnackBar('Pedido finalizado com sucesso!');
  }

  openSnackBar(mensagem: string) {
    this.snakbar.open(mensagem, 'Fechar', {
      duration: 3000
    });
  }
}
