import { Component } from "@angular/core";
import { ExampleDataService } from "../../services/data.service";
import { IconLoaderService } from "../../services/icon-loader.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(exampleData: ExampleDataService,
              iconLoader: IconLoaderService) {
    exampleData.load();
    iconLoader.load();
  }
}
