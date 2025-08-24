import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogClose } from "@angular/material/dialog";

@Component({
  selector: 'app-caixa-de-dialogo',
  imports: [
    MatButtonModule,
    MatDialogClose
],
  templateUrl: './caixa-de-dialogo.html',
  styleUrl: './caixa-de-dialogo.css'
})
export class CaixaDeDialogo {

  constructor(@Inject(MAT_DIALOG_DATA) public data: string) {
  }

}
