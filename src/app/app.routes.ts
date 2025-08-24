import { Routes } from '@angular/router';
import { CadastroDeMateriais } from './cadastro-de-materiais/cadastro-de-materiais';
import { EdicaoDeMateriais } from './edicao-de-materiais/edicao-de-materiais';
import { CompraDeMaterial } from './compra-de-material/compra-de-material';
import { VendaDeMaterial } from './venda-de-material/venda-de-material';
import { ListagemDePedidos } from './listagem-de-pedidos/listagem-de-pedidos';
import { Login } from './login/login';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    {path:'', redirectTo:'/vender', pathMatch:'full'},
    {path:'cadastrar', component:CadastroDeMateriais, canActivate: [authGuard]},
    {path:'editar', component:EdicaoDeMateriais, canActivate: [authGuard]},
    {path:'comprar', component:CompraDeMaterial, canActivate: [authGuard]},
    {path:'vender', component:VendaDeMaterial},
    {path:'listar', component:ListagemDePedidos, canActivate: [authGuard]},
    {path:'login', component:Login}
];
