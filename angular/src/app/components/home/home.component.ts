import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../../services/question.service';
import { UserService } from '../../services/user.service';
import { UIService } from '../../services/ui.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private userService: UserService,
    private questionService: QuestionService,
    private uiService: UIService,
    private router: Router
  ) { }

  ngOnInit( ) {
  }

  OpenTest(school_grade) {
    this.userService.GetUserToken().then(token => {
      this.questionService.GenerateTest(token, school_grade).toPromise().then(data => {
        if (!data.success) {
          this.uiService.OpenModal("Something went wrong", data.message);
        } else {
          this.questionService.SaveQuestionSet(data.questions).then(() => {
            this.router.navigate(['exam']);
          })
        }
      })
    })
  }
}
