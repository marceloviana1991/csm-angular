import { Component } from '@angular/core';
import { PedidoResponse, PedidoService } from '../service/pedido-service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, NgForm } from '@angular/forms';
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
export class ListagemDePedidos {

  mes: number | null = null;
  ano: number | null = null;

  pedidos: PedidoResponse[] = [];

  displayedColumns: string[] = ['id', 'nome', 'quantidade', 'valorTotal'];

  constructor(
    private pedidoService: PedidoService
  ) {}

  onSubmit(ngForm: NgForm) {
    if (this.mes && this.ano) {
      this.pedidoService.getPedidosPorMes(this.mes, this.ano).subscribe(pedidos => {
        this.pedidos = pedidos
      })
    }
  }
}

