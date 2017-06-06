import { Injectable } from "@angular/core";
import { MobTypes } from "../data/MobTypes";
import { Skilltree } from "../models/Skilltree";
import { Skill } from "../models/Skill";
import { Fire } from "../models/skills/Fire";
import { UUID } from "angular2-uuid";

@Injectable()
export class DataService {
  types = [];
  skilltrees: Skilltree[] = [];

  constructor() {
    MobTypes.forEach(value => {
      this.types.push(value)
    });

    let st = new Skilltree("Test", "testtt1", [], "");

    this.skilltrees.push(st);
    this.skilltrees.push(new Skilltree("Test", "testtt2", [], ""));
    this.skilltrees.push(new Skilltree("Test", "testtt3", [], ""));
    this.skilltrees.push(new Skilltree("Test", "testtt4", [], ""));
    this.skilltrees.push(new Skilltree("Test", "testtt5", [], ""));

    let fire = new Skill();
    st.skills["Fire"] = fire;

    let uuid = UUID.UUID();

    fire.upgrades.push(new Fire())
  }
}
