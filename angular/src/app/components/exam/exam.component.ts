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
      console.log(this.questions);
    })
    .catch(err => {
      this.uiService.OpenModal("An error has occurred", err);
      this.router.navigate(["home"]);
    })
  }

  RequestDiagram(diagramName) {
    return this.questionService.GetDiagramURL(diagramName);
  }

}
