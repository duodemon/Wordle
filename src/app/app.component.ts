import { Component } from '@angular/core';
import { HttpClient, JsonpClientBackend } from "@angular/common/http";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  letterGrid: any = [[{letter: "", state: 0}, {letter: "", state: 0}, {letter: "", state: 0}, {letter: "", state: 0}, {letter: "", state: 0}],
  [{letter: "", state: 0}, {letter: "", state: 0}, {letter: "", state: 0}, {letter: "", state: 0}, {letter: "", state: 0}],
  [{letter: "", state: 0}, {letter: "", state: 0}, {letter: "", state: 0}, {letter: "", state: 0}, {letter: "", state: 0}],
  [{letter: "", state: 0}, {letter: "", state: 0}, {letter: "", state: 0}, {letter: "", state: 0}, {letter: "", state: 0}],
  [{letter: "", state: 0}, {letter: "", state: 0}, {letter: "", state: 0}, {letter: "", state: 0}, {letter: "", state: 0}],
  [{letter: "", state: 0}, {letter: "", state: 0}, {letter: "", state: 0}, {letter: "", state: 0}, {letter: "", state: 0}]];
  rowNumber: number = 0;
  letterPosition: number = 0;
  solution: string = "HELLO";
  wordSet: Set<string> = new Set<string>();
  showNotInWordList: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getAllWords();
  }

  onKeydown(e: any) {
    if (this.rowNumber == 6) {
      return;
    }

    if (e.keyCode >= 65 && e.keyCode <= 90) { // a-z
      if (this.letterPosition < 5) {
        this.letterGrid[this.rowNumber][this.letterPosition].letter = e.key.toUpperCase();
        this.letterPosition++;
      }
    }
    else if (e.keyCode == 8) { // backspace
      if (this.letterPosition > 0) {
        this.letterPosition--;
      }
      this.letterGrid[this.rowNumber][this.letterPosition].letter = "";
      
    }
    else if (e.keyCode == 13) { // enter
      if (this.letterPosition == 5) {
        var tempWord = this.letterGrid[this.rowNumber][0].letter + this.letterGrid[this.rowNumber][1].letter + this.letterGrid[this.rowNumber][2].letter + this.letterGrid[this.rowNumber][3].letter + this.letterGrid[this.rowNumber][4].letter; 
        if (!this.wordSet.has(tempWord)) {
          this.showNotInWordList = true;
          return
        }
        this.showNotInWordList = false;
        this.verifyWord(tempWord);
        this.rowNumber++;
        this.letterPosition = 0;
      }
    }
  }

  verifyWord(tempWord: string) {
    var finalState = [0, 0, 0, 0, 0]
    var tempState = [0, 0, 0, 0, 0];
    let i;
    for (i = 0; i < 5; i++) {
      if (tempWord[i] == this.solution[i]) {
        finalState[i] = 3;
        tempState[i] = 3;
      }
    }
    for (i = 0; i < 5; i++) {
      if (finalState[i] == 0) {
        for (let j = 0; j < 5; j++) {
          if (i != j && tempState[j] == 0 && tempWord[i] == this.solution[j]) {
            finalState[i] = 2;
            tempState[j] = -1;
            break;
          }
        }
      }
      if (finalState[i] <= 0) {
        finalState[i] = 1;
      }
    }
    for (i = 0; i < 5; i++) {
      this.letterGrid[this.rowNumber][i].state = finalState[i];
    }
  }

  getCellClass(cell: any) {
    switch (cell.state) {
      case 1:
        return 'cell incorrect'
      case 2:
        return 'cell correctLetter'
      case 3:
        return 'cell correctPosition';
      default:
        return 'cell';
    }
  }

  getAllWords() {
    this.http.get('assets/words.txt', { responseType:'text' })
      .subscribe(
        data => {
          this.wordSet = new Set(data.toUpperCase().split('\r\n'));
        }
      )
   
  }
}
