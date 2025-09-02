import { Component, OnInit } from '@angular/core';
import { PedidoResponse, PedidoService } from '../service/pedido-service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { CaixaDeDialogo } from '../caixa-de-dialogo/caixa-de-dialogo';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-listagem-de-pedidos',
  imports: [
    FormsModule,
    MatFormFieldModule, 
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    CommonModule,
    MatCardModule
  ],
  templateUrl: './listagem-de-pedidos.html',
  styleUrl: './listagem-de-pedidos.css'
})
export class ListagemDePedidos implements OnInit {

  private today = new Date();

  mes: number | null = null
  ano: number | null = null

  pedidos: PedidoResponse[] = [];

  displayedColumns: string[] = ['nome', 'quantidade', 'valorTotal'];

  constructor(
    private pedidoService: PedidoService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.mes = this.today.getMonth() + 1;
    this.ano = this.today.getFullYear();
    this.onSubmit();

  }

  onSubmit() {
    if (this.mes && this.ano) {
      this.pedidoService.getPedidosPorMes(this.mes, this.ano).subscribe(pedidos => {
        this.pedidos = pedidos
        console.log(pedidos)
      })
    }
  }

  confirmarPagamento(id: number) {
    this.abrirCaixaDeDialogo('Deseja confirmar o pagamento do pedido?', () => {
      this.pedidoService.getPedidoConfirmarPagamento(id).subscribe(() => {
        this.ngOnInit();
      })
    })
  }

  cancelarPedido(id: number) {
    this.abrirCaixaDeDialogo('Deseja cancelar o pedido?', () => {
        this.pedidoService.getPedidoCancelar(id).subscribe(() => {
        this.pedidos = this.pedidos.filter(pedido => pedido.id !== id);
      })
    })
  }

  getTotalValue(items: any[]): number {
    return items.map(item => item.valorTotal).reduce((acc, value) => acc + value, 0);
  }

  getTotalQuantidade(items: any[]): number {
    return items.map(item => item.quantidade).reduce((acc, value) => acc + value, 0);
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

