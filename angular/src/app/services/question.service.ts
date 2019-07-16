import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Question } from '../classes/question';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private api: String = "http://localhost:5000";
  private num_question: Number = 10;

  constructor(
    private http: HttpClient
  ) { }

  public GenerateTest(userToken: String, school_grade: String): Observable<any> {
    let header: any = {
      headers: new HttpHeaders({"Content-Type": "application/json", "Authorization": `Bearer ${userToken}`})
    };
    return this.http.get(`${this.api}/exam/grade/${school_grade}/question/${this.num_question}`, header);
  }

  public SaveQuestionSet(questions: Question[]) {
    return new Promise((resolve, reject) => {
      localStorage.setItem("questions", JSON.stringify(questions));
      resolve();
    })
  }

  public GetQuestionSet() {
    return new Promise((resolve, reject) => {
      let savedQuestions = localStorage.getItem("questions");
      if (savedQuestions !== null) {
        resolve(JSON.parse(savedQuestions));
      } else {
        reject("Please do not refresh the page when doing an exam");
      }
    })
  }

  public GetDiagramURL(diagramName) {
    return `${this.api}/public/images/${diagramName}`
  }

  public CheckExamResult(userToken: String, items: any) {
    let header: any = {
      headers: new HttpHeaders({"Content-Type": "application/json", "Authorization": `Bearer ${userToken}`})
    };
    return this.http.post(`${this.api}/exam/check`, items, header);
  }
}
