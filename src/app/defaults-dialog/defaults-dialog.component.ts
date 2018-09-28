import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { IDefaultsData, DefaultsService } from '../defaults-service/defaults.service';

@Component({
  selector: 'app-defaults-dialog',
  templateUrl: './defaults-dialog.component.html',
  styleUrls: ['./defaults-dialog.component.css'],
  providers : [DefaultsService]
})
export class DefaultsDialogComponent {
  public lastStateSelected : string;
  public textDefaults : IDefaultsData;
  private statePropertyTax = {
    HI:	0.0031, MA:	0.0061, CO:	0.0062, WY:	0.0065, AL:	0.0067, DC:	0.0071, SC:	0.0076, WV:	0.0077, ID:	0.0080, UT:	0.0083,
    MT:	0.0086, WA:	0.0088, VA:	0.0088, ND:	0.0098, LA:	0.0104, IN:	0.0108, PA:	0.0109, NC:	0.0112, GA:	0.0113, NV:	0.0114,
    AR:	0.0115, OK:	0.0118, CA:	0.0118, AZ:	0.0118, KS:	0.0122, FL:	0.0125, KY:	0.0127, NM:	0.0127, AK:	0.0130, SD:	0.0135,
    MN:	0.0139, DE:	0.0140, MO:	0.0149, MS:	0.0152, RI:	0.0171, TX:	0.0178, TN:	0.0184, NY:	0.0197, ME:	0.0199, NE:	0.0202,
    OH:	0.0204, MD:	0.0209, VT:	0.0214, NH:	0.0225, OR:	0.0229, IA:	0.0230, WI:	0.0267, NJ:	0.0320, IL:	0.0372, CT:	0.0381, 
    MI:	0.0382};
  public recent = false;

  constructor(
    public dialogRef: MatDialogRef<DefaultsDialogComponent>,
    private _defaults: DefaultsService,
    @Inject(MAT_DIALOG_DATA) public data: {defaults: IDefaultsData, states: string[]}
  ) { 
    this.textDefaults = this._defaults.getDefaults();
    this.lastStateSelected = this.textDefaults.state;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  public onSelected(){
    if (this.lastStateSelected == this.data.defaults.state){
      return;
    } else {
      this.lastStateSelected = this.data.defaults.state;
      this.updateDefaults(this.data.defaults.state);
    }
  }

  private updateDefaults(state : string){
    if(state && this.statePropertyTax[state]){
      this.data.defaults.propertyTaxRate = this.statePropertyTax[state];
      this.recent = true;
      setTimeout(()=>{this.recent = false;}, 3000);
    }
  }

}
