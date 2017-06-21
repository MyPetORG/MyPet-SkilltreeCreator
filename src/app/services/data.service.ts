import { Injectable } from "@angular/core";
import { Skilltree } from "../models/Skilltree";
import { Skill } from "../models/Skill";
import { Fire } from "../models/skills/Fire";
import { UUID } from "angular2-uuid";
import { SkilltreeLoaderService } from "./skilltree-loader.service";
import { RideSkilltree } from "../data/ExampleSkilltrees";
import { Store } from "@ngrx/store";
import * as Reducers from "../reducers/index";
import * as SkilltreeActions from "../actions/skilltree";

@Injectable()
export class ExampleDataService {
  constructor(private loader: SkilltreeLoaderService,
              private store: Store<Reducers.State>) {
  }

  load() {
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

    this.store.dispatch(new SkilltreeActions.LoadSkilltreeAction(st1));
    this.store.dispatch(new SkilltreeActions.LoadSkilltreeAction(st2));
    this.store.dispatch(new SkilltreeActions.LoadSkilltreeAction(st3));
    this.store.dispatch(new SkilltreeActions.LoadSkilltreeAction(st4));

    this.loader.loadSkilltree(RideSkilltree).then(skilltree => {
      this.store.dispatch(new SkilltreeActions.LoadSkilltreeAction(skilltree));
    });

    let fire = new Skill<Fire>();
    st1.skills = {Fire: fire};

    let uuid = UUID.UUID();

    let upgrade = {rule: {every: 2}};
    fire.upgrades.push(upgrade);
  }
}
