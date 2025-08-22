import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './environment';
import { Material } from './material-service';
import { Observable } from 'rxjs';

export interface ItemDoPedido {
  material: Material;
  quantidade: number;
  valorTotal: number;
}

export interface Pedido {
  tipo: string
  itens: ItemDoPedidoRequest[]
}

export interface ItemDoPedidoRequest {
  materialId: number;
  quantidade: number;
  valorTotal: number;
}

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private endpointUrl = `${environment.apiUrl}/pedidos`; 

  constructor(private http: HttpClient) { }
  
  public postPedidoDeCompra(itensDoPedido: ItemDoPedido[]): Observable<void> {
    const itens: ItemDoPedidoRequest[] = itensDoPedido.map(item => {
      const id = item.material.id
      return {
        materialId: id,
        quantidade: item.quantidade,
        valorTotal: item.valorTotal
      }
    })
    const pedido: Pedido = {
      tipo: 'COMPRA',
      itens: itens
    }
    console.log(pedido)
    return this.http.post<void>(this.endpointUrl, pedido)
  }
}
