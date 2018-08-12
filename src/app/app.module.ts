import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatImportsModule } from './mat-imports/mat-imports.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { RentalComponent } from './rental/rental.component';
import { DefaultsDialogComponent } from './defaults-dialog/defaults-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    RentalComponent,
    DefaultsDialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MatImportsModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [DefaultsDialogComponent]
})
export class AppModule { }
