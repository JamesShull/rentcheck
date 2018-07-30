import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
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
    MatImportsModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
