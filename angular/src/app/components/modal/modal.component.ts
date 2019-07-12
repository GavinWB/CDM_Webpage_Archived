import { Component, OnInit } from '@angular/core';
import { UIService } from '../../services/ui.service';

declare var $: any;

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  private modalTitle: String;
  private modalContent: String;

  constructor(
    private uiService: UIService
  ) {
    uiService.observable.subscribe(data => {
      if (data.open) this.OpenModal(data.title, data.content);
      else this.CloseModal();
    });
  }

  ngOnInit() {
  }

  public OpenModal(title: String, content: String) {
    this.modalTitle = title;
    this.modalContent = content;
    $('#modal').modal('show');
  }

  public CloseModal() {
    $('#modal').modal('hide');
  }

}