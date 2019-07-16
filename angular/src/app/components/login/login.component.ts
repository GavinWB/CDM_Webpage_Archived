import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UIService } from '../../services/ui.service';
import { User } from '../../classes/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private user: User;

  constructor(
    private userService: UserService,
    private uiService: UIService,
    private router: Router
  ) { }

  ngOnInit() {
    this.user = new User();
  }

  OnLoginSubmit() {
    if (!(this.user.username) || !(this.user.password)) {
      this.uiService.OpenModal("Oops!", "Please fill the login form");
      return;
    }
    this.uiService.ShowButtonLoading('loginBtn');

    // Show loading animation for 1 sec
    setTimeout(() => {
      this.userService.AuthenticateUser(this.user).subscribe(data => {
        this.uiService.StopButtonLoading('loginBtn');

        if (data.success) {
          this.userService.StoreUsername(data.username);
          this.userService.StoreUserToken(data.token);
          this.router.navigate(['home']);
        } else {
          this.uiService.OpenModal("Oops!", data.message);
        }
      });
    }, 1000);
  }

}
