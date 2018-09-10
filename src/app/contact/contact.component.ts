import { Component, OnInit} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  public emailFrom : string;
  public emailBody : string;
  public emailName: string;

  constructor(private http: HttpClient) { }

  ngOnInit(){
    // subscribe to show snackbar on succss or error
  }

  public onSend(){
    // Get form data
    let body = { 'email':this.emailFrom, 'name':this.emailName, 'body':this.emailBody, };
    // set headers for API gateway
    let httpOptions = {headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    // Send it
    return this.http.post(
      'https://jhibgxqh3f.execute-api.us-west-1.amazonaws.com/test',
      JSON.stringify(body),
      httpOptions).subscribe(
        results => {console.log('results:');console.log(results);},
        err => console.error(err),
        () => {console.log('complete');}
      )
  }
}
