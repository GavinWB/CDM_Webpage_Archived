import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../../services/question.service';
import { UserService } from '../../services/user.service';
import { UIService } from '../../services/ui.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.css']
})
export class ExamComponent implements OnInit {
  private questions: any;

  constructor(
    private questionService: QuestionService,
    private userService: UserService,
    private uiService: UIService,
    private router: Router
    ) { }

  ngOnInit() {
    this.questionService.GetQuestionSet()
    .then(questions => {
      this.questions = questions;
    })
    .catch(err => {
      this.uiService.OpenModal("An error has occurred", err);
      this.router.navigate(["home"]);
    })
  }

  RequestDiagram(diagramName) {
    return this.questionService.GetDiagramURL(diagramName);
  }

  DisplayQuestion(question) {
    if (!question.isMultipleChoiceQuestion) return question.question;
    
    let splitted = question.question.split(/\s\([A-Z]\)\s/);
    return splitted[0];
  }

  DisplayChoices(question) {
    let choices = question.question.split(/\s\([A-Z]\)\s/);
    choices.shift(); // Remove the question

    let content = this.MakeChoiceList(question.originalQuestionID, choices);
    document.getElementById(question.originalQuestionID).innerHTML = content;
  }

  MakeChoiceList(questionID, choices) {
    let output = ``;
    let i = 0;

    for (let choice of choices) {
      output += `<input type="radio" name=${questionID} value=${String.fromCharCode(65 + i)}>  ${choice}</input><br />`
      i++;
    }

    return output;
  }
  
  OnTestSubmit() {
    let data = [];

    for (let item of this.questions) {
      let questionID = item.originalQuestionID;
      let answer = "";

      if (item.isMultipleChoiceQuestion) {
        let choices: any = document.getElementsByName(questionID);
        for (let ch of choices) {
          if (ch.checked) {
            answer = ch.value;
            break;
          }
        }
      } else {
        answer = (<HTMLInputElement>document.getElementById(questionID)).value;  
      }

      data.push({
        "questionID": questionID,
        "answer": answer
      })
    }

    this.userService.GetUserToken().then(userToken => {
      this.questionService.CheckExamResult(userToken, data).toPromise().then(data => {
        let result: any = data;

        localStorage.setItem("result", JSON.stringify(result));

        this.router.navigate(["result"]);
      })
    })
  }
}
