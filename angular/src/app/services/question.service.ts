import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Question } from '../classes/question';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private httpOptions: any = {
    headers: new HttpHeaders({"Content-Type": "application/json"})
  };
  private api: String = "http://localhost:5000";
  private num_question: Number = 25;

  constructor(
    private http: HttpClient
  ) { }

  public GenerateTest(userToken: String, school_grade: String): Observable<any> {
    let header: any = {
      headers: new HttpHeaders({"Content-Type": "application/json", "Authorization": `Bearer ${userToken}`})
    };
    return this.http.get(`${this.api}/exam/grade/${school_grade}/question/${this.num_question}`, header);
  }
}
