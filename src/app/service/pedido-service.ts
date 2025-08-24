import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Material } from './material-service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ItemDoPedido {
  material: Material;
  quantidade: number;
  valorTotal: number;
}

export interface Pedido {
  itens: ItemDoPedidoRequest[]
}

export interface ItemDoPedidoRequest {
  materialId: number;
  quantidade: number;
  valorTotal: number;
}

export interface ItemDoPedidoResponse {
  id: number;
  nome: string;
  quantidade: number;
  valorTotal: number;
}

export interface PedidoResponse {
  id: number;
  data: string;
  tipo: string;
  confirmado: boolean;
  itens: ItemDoPedidoResponse[];
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
      itens: itens
    }
    console.log(pedido)
    return this.http.post<void>(`${this.endpointUrl}/comprar`, pedido)
  }

  public postPedidoDeVenda(itensDoPedido: ItemDoPedido[]): Observable<void> {
    const itens: ItemDoPedidoRequest[] = itensDoPedido.map(item => {
      const id = item.material.id
      return {
        materialId: id,
        quantidade: item.quantidade,
        valorTotal: item.valorTotal
      }
    })
    const pedido: Pedido = {
      itens: itens
    }
    console.log(pedido)
    return this.http.post<void>(`${this.endpointUrl}/vender`, pedido)
  }

  public getPedidosPorMes(mes: number, ano: number): Observable<PedidoResponse[]> {
    const params = new HttpParams()
      .set('mes', mes.toString())
      .set('ano', ano.toString());
    return this.http.get<PedidoResponse[]>(this.endpointUrl, { params });
  }

  public getPedidoConfirmarPagamento(id: number): Observable<void> {
    return this.http.get<void>(`${this.endpointUrl}/confirmar/${id}`)
  }

  public getPedidoCancelar(id: number): Observable<void> {
    return this.http.get<void>(`${this.endpointUrl}/cancelar/${id}`)
  }
}
