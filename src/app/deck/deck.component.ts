import { Component, OnInit, OnDestroy } from '@angular/core';
import { DefaultsService, IDefaultsData } from '../defaults-service/defaults.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.css']
})
export class DeckComponent implements OnInit {
  rentals : Array<number>;
  showAbout = false;
  showContact = false;
  private subscription : Subscription;

  constructor(private _defaults: DefaultsService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.initRentals();
    this.subscription = this._defaults.addObs$.subscribe( 
      () => {this.addRental();},
      (error) => {console.log(error);},
      ()=> {console.log('complete');}
    );
  }
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
  private initRentals(){
    let rentalItem = localStorage.getItem('rentals');
    let tempRentals : Array<number> = (rentalItem) ? rentalItem.split(',').map(Number) : new Array();
    this.rentals = new Array();
    for (let i=0;i<tempRentals.length;i++){this.rentals.push( Number(tempRentals[i]) );}
    if (tempRentals.length == 0){this.addRental(true);}
  }
  public onDrop(rentalId : number) : void {
    this.rentals = this.rentals.filter(el=>{if(el!= rentalId){return el;}});
    let tempRentals = localStorage.getItem('rentals').split(',').map(Number);
    tempRentals = tempRentals.filter(el=>{if(el!= rentalId){return el;}});
    localStorage.setItem('rentals', tempRentals.toString());
    this.snackBar.open('Removed rental','',{duration: 1500});
  }
  public addRental(init?:boolean) : void { 
    this.rentals.push(new Date().getTime());
    localStorage.setItem('rentals', this.rentals.toString());
    if (!init){this.snackBar.open('New rental added','',{duration: 1500});}
  }
}
