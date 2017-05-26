import { Injectable } from "@angular/core";
import { MobTypes } from "../data/MobTypes";
import { MobType } from "../models/MobType";
import { Skilltree } from "../models/Skilltree";
import { StateService } from "./state.service";
import { Skill } from "../models/Skill";
import { Fire } from "../models/skills/Fire";
import { UUID } from "angular2-uuid";

@Injectable()
export class DataService {
  types: MobType[] = [];

  constructor(private seelection: StateService) {
    MobTypes.forEach(value => {
      let type = new MobType(value);
      this.types.push(type)
    });

    this.seelection.selectMobType(this.types[0]);

    let st = new Skilltree("Test", "testtt1", [], "");

    this.types[0].skilltrees.push(st);
    this.types[0].skilltrees.push(new Skilltree("Test", "testtt2", [], ""));
    this.types[0].skilltrees.push(new Skilltree("Test", "testtt3", [], ""));
    this.types[0].skilltrees.push(new Skilltree("Test", "testtt4", [], ""));
    this.types[0].skilltrees.push(new Skilltree("Test", "testtt5", [], ""));

    let fire = new Skill();
    st.skills["Fire"] = fire;

    let uuid = UUID.UUID();

    fire.upgrades.push(new Fire())
  }
}
