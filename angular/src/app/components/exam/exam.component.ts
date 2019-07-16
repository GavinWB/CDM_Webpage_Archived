import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../../services/question.service';
import { UIService } from '../../services/ui.service';
import { Router } from '@angular/router';
import { Question } from '../../classes/question';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.css']
})
export class ExamComponent implements OnInit {
  private questions: any;

  constructor(
    private questionService: QuestionService,
    private uiService: UIService,
    private router: Router) { }

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

    for (let choice of choices) {
      output += `<input type="radio" name=${questionID} value=${choice}>  ${choice}</input><br />`
    }

    return output;
  }
}
