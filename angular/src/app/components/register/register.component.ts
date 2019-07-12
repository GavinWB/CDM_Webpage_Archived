import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UIService } from '../../services/ui.service';

import { User } from '../../classes/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  private user: User;
  private confirmPassword: String;

  constructor(
    private router: Router,
    private userService: UserService,
    private uiService: UIService
  ) { }

  ngOnInit() {
    this.user = new User();
  }

  private OnRegisterSubmit() {
    if (!this.user.username) {
      this.uiService.OpenModal("Empty field", "Please choose an username");
    } else if (!this.user.password) {
      this.uiService.OpenModal("Empty field", "Please choose a password");
    } else if (this.user.password != this.confirmPassword) {
      this.uiService.OpenModal("Password confirm", "Please confirm your password");
    } else {
      this.uiService.ShowButtonLoading('registerBtn');
  
      setTimeout(() => {
        this.userService.RegisterUser(this.user).subscribe(data => {
          this.uiService.StopButtonLoading('registerBtn');

          if (data.success) {
            this.uiService.OpenModal("Success", "Your account has been created");
            this.router.navigate(['login']);
          } else {
            this.uiService.OpenModal("Oops!", data.message);
          }
        })
      }, 1000);
    }
  }

  private ValidateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
}