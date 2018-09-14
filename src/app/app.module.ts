import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MatImportsModule } from './mat-imports/mat-imports.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { RentalComponent } from './rental/rental.component';
import { DefaultsDialogComponent } from './defaults-dialog/defaults-dialog.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { DeckComponent } from './deck/deck.component';
import { ErrorComponent } from './error/error.component';
import { GuideComponent } from './guide/guide.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { TermsComponent } from './terms/terms.component';
import { LoadDialogComponent } from './load-dialog/load-dialog.component';
import { HelpSnackbarComponent } from './help-snackbar/help-snackbar.component';

const appRoutes : Routes = [
  {path:'home', component: DeckComponent},
  {path:'index.html', component: DeckComponent},
  {path:'about', component: AboutComponent},
  {path:'contactus', component: ContactComponent},
  {path:'guide', component: GuideComponent},
  {path:'privacy', component: PrivacyComponent},
  {path:'terms', component: TermsComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: '**', component: ErrorComponent } // update to have error view
];

@NgModule({
  declarations: [
    AppComponent,
    RentalComponent,
    DefaultsDialogComponent,
    AboutComponent,
    ContactComponent,
    DeckComponent,
    ErrorComponent,
    GuideComponent,
    PrivacyComponent,
    TermsComponent,
    LoadDialogComponent,
    HelpSnackbarComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes,
      //{ enableTracing: true } // <-- debugging purposes only
    ),
    BrowserModule,
    FormsModule,
    MatImportsModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [DefaultsDialogComponent, LoadDialogComponent, HelpSnackbarComponent]
})
export class AppModule { }
