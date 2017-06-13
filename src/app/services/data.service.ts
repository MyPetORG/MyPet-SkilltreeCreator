import { Injectable } from "@angular/core";
import { MobTypes } from "../data/MobTypes";
import { Skilltree } from "../models/Skilltree";
import { Skill } from "../models/Skill";
import { Fire } from "../models/skills/Fire";
import { UUID } from "angular2-uuid";
import { SkilltreeLoaderService } from "./skilltree-loader.service";
import { RideSkilltree } from "../data/ExampleSkilltrees";

@Injectable()
export class DataService {
  types = [];
  skilltrees: Skilltree[] = [];

  constructor(loader: SkilltreeLoaderService) {
    MobTypes.forEach(value => {
      this.types.push(value)
    });

    let st1: Skilltree = {
      name: "Test1",
      displayName: "testtt1",
      description: ["a", "<red>b"],
      skills: {},
      mobtypes: []
    };
    let st2: Skilltree = {name: "Test2", displayName: "testtt2", skills: {}, mobtypes: []};
    let st3: Skilltree = {name: "Test3", displayName: "testtt3", skills: {}, mobtypes: []};
    let st4: Skilltree = {name: "Test4", displayName: "testtt4", skills: {}, mobtypes: []};

    this.skilltrees.push(st1);
    this.skilltrees.push(st2);
    this.skilltrees.push(st3);
    this.skilltrees.push(st4);

    loader.loadSkilltree(RideSkilltree).then(skilltree => {
      this.skilltrees.push(skilltree);
    });

    let fire = new Skill<Fire>();
    st1.skills = {Fire: fire};

    let uuid = UUID.UUID();

    let upgrade = {rule: {every: 2}};
    fire.upgrades.push(upgrade);
  }
}
