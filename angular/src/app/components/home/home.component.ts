import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../../services/question.service';
import { UserService } from '../../services/user.service';
import { UIService } from '../../services/ui.service';
import { Question } from '../../classes/question';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private userService: UserService,
    private questionService: QuestionService,
    private uiService: UIService
  ) { }

  ngOnInit( ) {
  }

  OpenTest(school_grade) {
    this.userService.GetUserToken().then(userToken => {
      this.questionService.GenerateTest(userToken, school_grade).toPromise().then(data => {
        if (!data.success) {
          this.uiService.OpenModal("Something went wrong", data.message);
        } else {
          console.log(data.questions);
        }
      })
    })
  }
}
