import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatImportsModule } from './mat-imports/mat-imports.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { RentalComponent } from './rental/rental.component';

@NgModule({
  declarations: [
    AppComponent,
    RentalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MatImportsModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
