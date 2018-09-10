import { Component, OnInit} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  public emailFrom : string;
  public emailContent : string;
  public emailName: string;

  constructor(private http: HttpClient, private snackbar: MatSnackBar) { }

  ngOnInit(){
    // subscribe to show snackbar on succss or error
  }

  public onSend(){
    // Get form data
    let requestBody = { 'email':this.emailFrom, 'name':this.emailName, 'content':this.emailContent, };
    // set headers for API gateway
    let httpOptions = {headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    console.log(requestBody);

    // Send it
    this.http.post(
      'https://jhibgxqh3f.execute-api.us-west-1.amazonaws.com/test',
      requestBody,
      httpOptions
      ).subscribe(
        results => {
          if(results["statusCode"] == 200){
            this.snackbar.open(results["body"],'Close',{duration: 1500});
          }
        },
        err => console.error(err),
        () => {
          this.emailContent = '';
          this.emailName = '';
          this.emailFrom = '';
          // Service completed successfully
        }
    );
  }
}
