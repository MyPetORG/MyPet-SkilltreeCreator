import { Component } from "@angular/core";
import { ExampleDataService } from "../../services/data.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(exampleData: ExampleDataService) {
    exampleData.load();
  }
}
