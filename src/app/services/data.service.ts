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
      id: "Test1",
      name: "testtt1",
      description: ["a", "<red>b"],
      skills: {},
      mobtypes: []
    };
    let st2: Skilltree = {id: "Test2", name: "testtt2", skills: {}, mobtypes: []};
    let st3: Skilltree = {id: "Test3", name: "testtt3", skills: {}, mobtypes: []};
    let st4: Skilltree = {id: "Test4", name: "testtt4", skills: {}, mobtypes: []};

    this.store.dispatch(new SkilltreeActions.LoadSkilltreeAction(st1));
    this.store.dispatch(new SkilltreeActions.LoadSkilltreeAction(st2));
    this.store.dispatch(new SkilltreeActions.LoadSkilltreeAction(st3));
    this.store.dispatch(new SkilltreeActions.LoadSkilltreeAction(st4));

    this.loader.loadSkilltree(RideSkilltree).then(skilltree => {
      this.store.dispatch(new SkilltreeActions.LoadSkilltreeAction(skilltree));
    });

    let fire: Skill<Fire> = {upgrades: []};
    st1.skills = {Fire: fire};

    let uuid = UUID.UUID();

    let upgrade = {rule: {every: 2}};
    fire.upgrades.push(upgrade);
  }
}
