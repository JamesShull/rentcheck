import { Component} from '@angular/core';
import { MatDialogRef} from '@angular/material';
import { promise } from 'protractor';

@Component({
  selector: 'app-load-dialog',
  templateUrl: './load-dialog.component.html',
  styleUrls: ['./load-dialog.component.css']
})
export class LoadDialogComponent {
  public filesContent: string[];
  public fileNames: string[];

  constructor(public dialogRef: MatDialogRef<LoadDialogComponent>) { }

  public onCancel(){
    this.dialogRef.close();
  }

  public handleFiles(files: FileList){
    if(!files){return;}
    if(!this.filesContent){ 
      this.filesContent = new Array<string>();
      this.fileNames = new Array<string>();
    }
    for (let i=0, numFiles = files.length; i<numFiles;i++){
      (async ()=>{
        try {
          this.filesContent.push((await this.promiseReadFileAsText(files[i])).toString());
          //this.filesContent += await this.promiseReadFileAsText(files[i]);
          this.fileNames.push((i+1)+': '+files[i].name);
        } catch (e) {
          console.warn(e.message);
        }
      })();
    }
  }
  /* Promisify ReadFileAsText to enable string concatenation in for loop */
  private promiseReadFileAsText = (inputFile:File)=>{
    let tempFileReader = new FileReader();
    return new Promise((resolve, reject) => {
      tempFileReader.onerror = () => {
        tempFileReader.abort();
        reject(new DOMException("Problem reading file"));
      };
      tempFileReader.onload = () => {
        resolve(tempFileReader.result);
      };
      tempFileReader.readAsText(inputFile)
    });
  }
}
