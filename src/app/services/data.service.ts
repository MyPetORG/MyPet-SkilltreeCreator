import { Injectable } from "@angular/core";
import { MobTypes } from "../data/MobTypes";
import { MobType } from "../models/MobType";
import { Skilltree } from "../models/Skilltree";
import { SelectionService } from "./selection.service";

@Injectable()
export class DataService {
  types: MobType[] = [];

  constructor(private seelection: SelectionService) {
    MobTypes.forEach(value => {
      let type = new MobType(value);
      this.types.push(type)
    });

    this.seelection.selectMobType(this.types[0]);

    this.types[0].skilltrees.push(new Skilltree("Test", "testtt1", [], ""));
    this.types[0].skilltrees.push(new Skilltree("Test", "testtt2", [], ""));
    this.types[0].skilltrees.push(new Skilltree("Test", "testtt3", [], ""));
    this.types[0].skilltrees.push(new Skilltree("Test", "testtt4", [], ""));
    this.types[0].skilltrees.push(new Skilltree("Test", "testtt5", [], ""));
  }
}
