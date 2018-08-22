import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-howto',
  templateUrl: './howto.component.html',
  styleUrls: ['./howto.component.css']
})
export class HowtoComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  public onDrop(){
    console.log('drop howto');
  }
}
