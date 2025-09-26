import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-card',
  standalone: true,
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css'],
  imports: [RouterLink],
})
export class UserCardComponent {
  @Input() user: any;
  @Output() delete = new EventEmitter<any>();

  onDelete() {
    this.delete.emit(this.user);
  }
}
