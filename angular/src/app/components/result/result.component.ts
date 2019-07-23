import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { QuestionService } from '../../services/question.service';
import { UIService } from '../../services/ui.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {
  private data: any;
  private skill_name_4: any = [
    "Representing, comparing, and ordering whole numbers as well as demonstrating knowledge of place value",
    "Recognize multiples, computing with whole numbers using the four operations, and estimating computations",
    "Solve problems, including those set in real life contexts",
    "Solve problems involving proportions",
    "Recognize, represent, and understand fractions and decimals as parts of a whole and their equivalents",
    "Solve problems involving simple fractions and decimals including their addition and subtraction",
    "Find the missing number or operation and model simple situations in number sentence or expressions",
    "Describe relationships in patterns and their extensions, generate pairs of whole numbers by a given rule and identify a rule for every relationship given pairs of whole numbers",
    "Measure, estimate, and understand properties of lines and angles and be able to draw them",
    "Classify, compare, and recognize geometric figures and shapes and their relationships and elementary properties",
    "Calculate and estimate perimeters, area, and volume",
    "Locate points in a coordinate to recognize and draw figures and their movement",
    "Read data from tables, pictographs, bar graphs, and pie charts",
    "Comparing and understanding how to use information from data",
    "Understanding different representations and organizing data using tables, pictographs, and bar graphs"
  ]
  private skill_name_8: any = [
    "Understand concepts of a ratio and a unit rate and use language appropriately",
    "Use ratio and rate reasoning to solve real world and mathematical problems",
    "Compute fluently with multi-digit numbers and find common factors and multiples",
    "Apply and extend previous understandings of numbers to the system of rational numbers",
    "Apply and extend previous understandings of arithmetic to algebraic expressions",
    "Reason about and solve one-variable equations and inequalities",
    "Recognize and represent proportional relationships between quantities",
    "Use proportional relationships to solve multi-step ratio and percent problems",
    "Apply and extend previous understandings of operations with fractions to add, subtract, multiply, and divide rational numbers",
    "Solve real-world and mathematical problems involving the four operations with rational numbers",
    "Solve real-life and mathematical problems using numerical and algebraic expressions and equations",
    "Know and apply the properties of integer exponents to generate equivalent numerical expressions",
    "Compare two fractions with different numerators and different denominators",
    "Solve multi-step word problems posed with whole numbers and having whole-number answers using the four operations, including problems in which remainders must be interpreted",
    "Use equivalent fraction as a strategy to add and subtract fractions"
  ]

  constructor(
    private userService: UserService,
    private questionService: QuestionService,
    private uiService: UIService,
    private router: Router
    ) { }

  ngOnInit() {
    this.data = localStorage.getItem("result");
    if (this.data !== null) {
      this.data = JSON.parse(this.data);
    } else {
      this.router.navigate(["home"]);
      return;
    }

    if (this.data.grade != 4 && this.data.grade != 8) {
      localStorage.removeItem("result");
      this.uiService.OpenModal("Oops!", "Can not parse test result from the server");
      this.router.navigate(["home"]);
    }
    
    // Format skill vector
    if (this.data.skill_state.length > 15) {
      let s = this.data.skill_state;
      s = s.replace("[", "");
      s = s.replace("]", "");
      s = s.split(" ");
      this.data.skill_state = s;
    }
  }

  RequestRemedialQuestions() {
    let param = {
      grade: this.data.grade,
      student_skill: this.data.skill_state.join(" ")
    }

    this.userService.GetUserToken().then(token => {
      this.questionService.GenerateRemedialQuestions(token, param).toPromise().then(data => {
        let res: any = data;
        this.OpenTest(res.questions);
      })
    })
  }


  OpenTest(questions) {
    this.questionService.SaveQuestionSet(questions).then(() => {
      this.router.navigate(['exam']);
    });
  }

}
