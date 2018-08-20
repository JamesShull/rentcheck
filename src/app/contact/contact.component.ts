import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  @Output() close = new EventEmitter<any>();
  constructor() { }

  public onClose(){
    this.close.emit();
  }
}
