import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-help-snackbar',
  templateUrl: './help-snackbar.component.html',
  styleUrls: ['./help-snackbar.component.css']
})
export class HelpSnackbarComponent {

  constructor(public snackBar: MatSnackBar) { }

  public closeHelp(): void {
    localStorage.setItem('showHelp', 'false');
    this.snackBar.dismiss();
}
}
