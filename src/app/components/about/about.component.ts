import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'stc-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent {

  version = environment.version;

  getYear() {
    return (new Date()).getFullYear();
  }
}
