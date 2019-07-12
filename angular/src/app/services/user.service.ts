import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../classes/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private httpOptions: any = {
    headers: new HttpHeaders({"Content-Type": "application/json"})
  };
  private api: String = "http://localhost:5000";
  private userToken: String;
  private username: String;

  constructor(
    private http: HttpClient
  ) { }

  public AuthenticateUser(user: User): Observable<any> {
    return this.http.post(`${this.api}/login`, user, this.httpOptions);
  }

  public RegisterUser(user: User): Observable<any> {
    return this.http.post(`${this.api}/register`, user, this.httpOptions);
  }

  public StoreUserToken(userToken: String) {
    this.userToken = userToken;
    localStorage.setItem("userToken", JSON.stringify(userToken));
  }

  public StoreUsername(username: String) {
    this.username = username;
    localStorage.setItem("username", JSON.stringify(username));
  }

  public GetUserToken(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.userToken) return resolve(this.userToken);
      else {
        let savedUserToken = localStorage.getItem("userToken");
        if (savedUserToken !== null) {
          this.userToken = JSON.parse(savedUserToken);
          resolve(this.userToken)
        } else {
          this.Logout();
          reject();
        }
      }
    })
  }

  public GetUsername(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.username) return resolve(this.username);
      else {
        let savedUsername = localStorage.getItem("username");
        if (savedUsername !== null) {
          this.username = JSON.parse(savedUsername);
          resolve(this.username)
        } else {
          this.Logout();
          reject();
        }
      }
    })
  }

  public IsLoggedIn() {
    this.GetUserToken()
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      })
  }

  public Logout() {
    this.userToken = "";
    this.username = "";
    localStorage.clear();
  }
}
