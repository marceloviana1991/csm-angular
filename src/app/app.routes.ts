import { Routes } from '@angular/router';
import { CadastroDeMateriais } from './cadastro-de-materiais/cadastro-de-materiais';
import { EdicaoDeMateriais } from './edicao-de-materiais/edicao-de-materiais';

export const routes: Routes = [
    {path:'cadastrar', component:CadastroDeMateriais},
    {path:'editar', component:EdicaoDeMateriais}
];
