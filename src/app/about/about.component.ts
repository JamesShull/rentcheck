import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  @Output() close = new EventEmitter<any>();
  constructor() { }

  public onClose(){
    this.close.emit();
  }
}
