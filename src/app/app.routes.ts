import { Routes } from '@angular/router';
import { CadastroDeMateriais } from './cadastro-de-materiais/cadastro-de-materiais';
import { EdicaoDeMateriais } from './edicao-de-materiais/edicao-de-materiais';
import { CompraDeMaterial } from './compra-de-material/compra-de-material';
import { VendaDeMaterial } from './venda-de-material/venda-de-material';

export const routes: Routes = [
    {path:'', redirectTo:'/vender', pathMatch:'full'},
    {path:'cadastrar', component:CadastroDeMateriais},
    {path:'editar', component:EdicaoDeMateriais},
    {path:'comprar', component:CompraDeMaterial},
    {path:'vender', component:VendaDeMaterial}
];
