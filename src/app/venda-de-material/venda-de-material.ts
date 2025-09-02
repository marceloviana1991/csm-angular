import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
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
import { LoginService } from '../service/login-service';
import { WhatsappService } from '../service/whatsapp';

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

  @ViewChild('tabelaDeItens') tabelaDeItens!: ElementRef;

  grupos: Grupo[] = []
  materiais: Material[] = []
  itensDoPedido: ItemDoPedido[] = []
  cliente: string | null = null
  telefone: string | null = null

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
    private dialog: MatDialog,
    private loginService: LoginService,
    private whatsappService: WhatsappService
  ) {}

  ngOnInit(): void {
    this.grupoService.getGrupos().subscribe( grupos => {
      this.grupos = grupos;
    })

    console.log(this.loginService.estaAutenticado())

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
      itemDoPedidoExistente.valorTotal += itemDoPedidoExistente.quantidade*itemDoPedidoExistente.material.preco;

      if (this.materialSelecionado.quantidadeEmEstoque < itemDoPedidoExistente.quantidade) {
        this.openSnackBar('Quantidade indiponível!');
        itemDoPedidoExistente.quantidade -= this.quantidade;
        itemDoPedidoExistente.valorTotal -= itemDoPedidoExistente.quantidade*itemDoPedidoExistente.material.preco;
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

    setTimeout(() => {
      this.tabelaDeItens.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
}

  removerItem(itemParaRemover: ItemDoPedido) {
    this.itensDoPedido = this.itensDoPedido.filter(item => item !== itemParaRemover);
    if (this.itensDoPedido.length === 0) {
      this.cliente = null;
      this.telefone = null;
    }
  }

  finalizarPedido() {
    this.abrirCaixaDeDialogo('Deseja confirmar envio de pedido?', () => {
      this.pedidoService.postPedidoDeVenda(this.itensDoPedido, this.cliente!, this.telefone!).subscribe({
        next: () => {
          const telefone = sessionStorage.getItem('telefone');

        let total = 0;
        
        // 1. Formata a lista de itens
        const itensMensagem = this.itensDoPedido.map(item => {
          total += item.valorTotal;
          // Formata o valor para o padrão BRL (R$ 12,34)
          const valorFormatado = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valorTotal);
          return `• ${item.quantidade} - ${item.material.nome} - ${valorFormatado}`;
        }).join('\n'); // Usa 'join' para unir todos os itens com uma quebra de linha

        // 2. Formata o valor total
        const totalFormatado = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total);

        // 3. Monta a mensagem final com formatação e estrutura
        const mensagemWhatsapp = `
*Olá! 👋 Seu pedido foi recebido!*

Aqui está o resumo para sua conferência:

${itensMensagem}

-----------------------------------
*Total a pagar: ${totalFormatado}*

Para concluir, por favor, realize o pagamento via Pix.

*Chave Pix (Celular):*
${telefone}
`;

        // --- FIM DA CONSTRUÇÃO DA MENSAGEM ---

        this.whatsappService.enviarMensagem(telefone!, mensagemWhatsapp);

        // Limpeza do formulário e estado do componente
        this.itensDoPedido = [];
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
