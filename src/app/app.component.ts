import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Rent Check';
  public interestRate = .0461;    // 4.61% default
  public loanTerm = 360;          // 30 yr default
  public downPayment = .20;       // 20% default
  public insuranceRate = .0020;   // 0.20% / yr default
  public maintenanceRate = .0018; // 0.18% / yr default
  public propertyTaxRate = .01095 // 1.09% / yr default
  public salaryTaxRate = 0.22     // 22% default
}
