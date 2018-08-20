import { Component, OnInit } from '@angular/core';
//import { DefaultsService, IDefaultsData } from '../defaults-service/defaults.service';

@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.css']
})
export class DeckComponent implements OnInit {
  rentals : Array<number>;
  showAbout = false;
  showContact = false;
  constructor() { }

  ngOnInit() {
    this.initRentals();
  }
  /*
  public toggleAbout(){
    this.showAbout = !this.showAbout;
  }
  public toggleContact(){
    this.showContact = !this.showContact;
  }
  */
  private initRentals(){
    let rentalItem = localStorage.getItem('rentals');
    let tempRentals : Array<number> = (rentalItem) ? rentalItem.split(',').map(Number) : new Array();
    this.rentals = new Array();
    for (let i=0;i<tempRentals.length;i++){this.rentals.push( Number(tempRentals[i]) );}
    if (tempRentals.length == 0){this.addRental();}
  }
  public onDrop(rentalId : number) : void {
    this.rentals = this.rentals.filter(el=>{if(el!= rentalId){return el;}});
    let tempRentals = localStorage.getItem('rentals').split(',').map(Number);
    tempRentals = tempRentals.filter(el=>{if(el!= rentalId){return el;}});
    localStorage.setItem('rentals', tempRentals.toString());
  }
  public addRental() : void { 
    this.rentals.push(new Date().getTime());
    localStorage.setItem('rentals', this.rentals.toString());
  }
}
