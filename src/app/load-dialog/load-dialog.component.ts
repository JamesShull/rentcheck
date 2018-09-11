import { Component} from '@angular/core';
import { MatDialogRef} from '@angular/material';
import { promise } from 'protractor';

@Component({
  selector: 'app-load-dialog',
  templateUrl: './load-dialog.component.html',
  styleUrls: ['./load-dialog.component.css']
})
export class LoadDialogComponent {
  public filesContent: string;
  public fileNames: string[];

  constructor(public dialogRef: MatDialogRef<LoadDialogComponent>) { }

  public onCancel(){
    this.dialogRef.close();
  }

  public handleFiles(files: FileList){
    if(!files){return;}
    this.filesContent = '[';
    this.fileNames = new Array();
    for (let i=0, numFiles = files.length; i<numFiles;i++){
      (async ()=>{
        try {
          this.filesContent += await this.promiseReadFileAsText(files[i]);
          this.fileNames.push((i+1)+': '+files[i].name);
          if (i != numFiles - 1){ 
            this.filesContent += ',';
          }else{
            this.filesContent += ']';
          }
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
