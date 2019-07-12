import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UIService {
  observable = new BehaviorSubject<any>({});

  constructor() { }

  public OpenModal(title: String, content: String) {
    this.observable.next({open: true, title: title, content: content});
  }

  public CloseModal() {
    this.observable.next({open: false});
  }

  public ShowButtonLoading(buttonId) {
    document.getElementById(buttonId).classList.add("running");
  }

  public StopButtonLoading(buttonId) {
    document.getElementById(buttonId).classList.remove("running");
  }
}
