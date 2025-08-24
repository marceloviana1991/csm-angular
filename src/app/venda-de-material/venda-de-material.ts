import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { ItemDoPedido, PedidoService } from '../service/pedido-service';
import { Grupo, GrupoService } from '../service/grupo-service';
import { Material, MaterialService } from '../service/material-service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { CaixaDeDialogo } from '../caixa-de-dialogo/caixa-de-dialogo';

@Component({
  selector: 'app-venda-de-material',
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
  templateUrl: './venda-de-material.html',
  styleUrl: './venda-de-material.css'
})
export class VendaDeMaterial {

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
    private pedidoService: PedidoService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.grupoService.getGrupos().subscribe( grupos => {
      this.grupos = grupos;
    })
  }

  onGrupoSelecionado(event: MatSelectChange) {
    const grupoId = event.value;
    this.materialService.getMateriaisByGrupoVenda(grupoId).subscribe( materiais => {
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
        quantidade: this.quantidade,
        valorTotal: this.quantidade*this.materialSelecionado.preco
      };
      
      this.itensDoPedido.push(itemDoPedido);
    }

    this.itensDoPedido = [...this.itensDoPedido];
    this.openSnackBar('Item adicionado ao pedido!');
}

  removerItem(itemParaRemover: ItemDoPedido) {
    this.itensDoPedido = this.itensDoPedido.filter(item => item !== itemParaRemover);
    this.openSnackBar('Item revido do pedido!');
  }

  finalizarPedido() {
    this.abrirCaixaDeDialogo('Deseja confirmar envio de pedido?', () => {
      this.pedidoService.postPedidoDeVenda(this.itensDoPedido).subscribe({
        next: () => {
          this.itensDoPedido = []
          this.form.resetForm();
          this.quantidade = 1;
          this.materiais = [];
          this.materialSelecionado = null;
          this.limparRecursosDaImagem();
          this.openSnackBar('Pedido finalizado com sucesso!');
        }
      })
    })
  }

  openSnackBar(mensagem: string) {
    this.snakbar.open(mensagem, 'Fechar', {
      duration: 3000
    });
  }

  abrirCaixaDeDialogo(mensagem: string, operacaoDeConfirmacao: () => void): void {
    let dialogRef = this.dialog.open(CaixaDeDialogo, {
      data: mensagem
    });

    dialogRef.afterClosed().subscribe( result => {
      if (result) {
        operacaoDeConfirmacao()
      }
    })
  }

}
