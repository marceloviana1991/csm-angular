import { Component, OnInit } from '@angular/core';
import { PedidoResponse, PedidoService } from '../service/pedido-service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-listagem-de-pedidos',
  imports: [
    FormsModule,
    MatFormFieldModule, 
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    CommonModule
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
    private pedidoService: PedidoService
  ) {}

  ngOnInit(): void {
    this.mes = this.today.getMonth() + 1;
    this.ano = this.today.getFullYear();
    this.onSubmit()

  }

  onSubmit() {
    if (this.mes && this.ano) {
      this.pedidoService.getPedidosPorMes(this.mes, this.ano).subscribe(pedidos => {
        this.pedidos = pedidos
      })
    }
  }

  confirmarPagamento(id: number) {
    this.pedidoService.getPedidoConfirmarPagamento(id).subscribe(() => {
      this.pedidos = [];
      this.ano = null;
      this.mes = null;
    })
  }

  cancelarPedido(id: number) {
    this.pedidoService.getPedidoCancelar(id).subscribe(() => {
    this.pedidos = this.pedidos.filter(pedido => pedido.id !== id);
    })
  }

  getTotalValue(items: any[]): number {
    return items.map(item => item.valorTotal).reduce((acc, value) => acc + value, 0);
  }

  getTotalQuantidade(items: any[]): number {
    return items.map(item => item.quantidade).reduce((acc, value) => acc + value, 0);
  }


}

