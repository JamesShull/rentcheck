import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-guide',
  templateUrl: './guide.component.html',
  styleUrls: ['./guide.component.css']
})
export class GuideComponent implements OnInit {
  public terms = [
    { term:'', definition:''},
    { term:'outflow', definition:'Cash Outflow, is the amount of money required each month, not including tax savings at the end of the year. Often landlords like to have outflow less than rent to cover all the expenses.'},
    { term:'income', definition:'How much money the rental should make each month. This includes tax savings, so the benefits are only fully realized after tax refunds are received.'},
    { term:'yield', definition:'This is the annual income over the amount invested (i.e. downpayment plus transaction fees)'},
    { term:'cap rate', definition:'Capitalization Rate is the annual income over the asset value (i.e. property price plus transaction fees). Often used to determine '},
    { term:'Down Payment', definition:'Percentage of property price that you provide up front.'},
    { term:'Income Tax Rate', definition:'The benefit to tax write offs depends on your personal income bracket, unless you\'re incorporating entities to own the property.'},
    { term:'Interest Rate', definition:'Interest Rate for the mortgage. Increase from the default if your credit score is below 760.'},
    { term:'Insurance Rate', definition:'Cost of insuring the property on an annualized basis (i.e. Insurance charges 0.18% of the price each year)'},
    { term:'Loan Term', definition:'Length of the mortgage in months. 30 years = 360 months is most common, but lower interest rates are available for 15 years = 180 months.'},
    { term:'Management Rate', definition: 'Property management companies will find renters, handle payments and take maintenance calls, but they\'ll collect about 10% of rent as a fee'},
    { term:'Maintenance Rate', definition:'Cost of keeping up the property. Does not include the mega renovation that is usually needed every 15-20 years.'},
    { term:'Mello-Roos', definition:'A parcel (not based on price) tax that is common to newer developments in California (built after 1982).'},
    { term:'Property Tax Rate', definition:'Property taxes vary wildly by each locality. Make sure to set the defaults to a typical value for the area in consideration.'},
    { term:'Purchase Date', definition:'The purchase date of the property, which helps to determine mortgage interest/principal and related tax benefits.'},
    { term:'Vacancy Rate', definition:'The property will be vacant (no rent) while renters leave and the place is cleaned up. The defaults assume one month every 2 years, or 4.2%.'}
  ];

  public selectedTerm : any;

  constructor() { }

  ngOnInit() {
  }

}
