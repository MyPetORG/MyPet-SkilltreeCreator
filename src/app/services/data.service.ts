import { Injectable } from "@angular/core";
import { Skilltree } from "../models/Skilltree";
import { SkilltreeLoaderService } from "./skilltree-loader.service";
import { RideSkilltree } from "../data/ExampleSkilltrees";
import { Store } from "@ngrx/store";
import * as Reducers from "../reducers/index";
import * as SkilltreeActions from "../actions/skilltree";
import { Backpack, BackpackDefault } from "../models/skills/Backpack";

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

    let upgrades = [];
    let upgrade: Backpack = Object.assign({rule: {every: 2}}, new BackpackDefault);
    let upgrade2: Backpack = Object.assign({rule: {every: 2}}, new BackpackDefault);
    upgrades.push(upgrade, upgrade2);

    st1.skills = {Backpack: [upgrade.id, upgrade2.id]};
    let st2: Skilltree = {id: "Test2", name: "testtt2", skills: {}, mobtypes: []};
    let st3: Skilltree = {id: "Test3", name: "testtt3", skills: {}, mobtypes: []};
    let st4: Skilltree = {id: "Test4", name: "testtt4", skills: {}, mobtypes: []};

    this.store.dispatch(new SkilltreeActions.AddSkilltreeAction(st1));
    this.store.dispatch(new SkilltreeActions.AddSkilltreeAction(st2));
    this.store.dispatch(new SkilltreeActions.AddSkilltreeAction(st3));
    this.store.dispatch(new SkilltreeActions.AddSkilltreeAction(st4));


    this.store.dispatch(new SkilltreeActions.LoadSkilltreeAction(RideSkilltree));
  }
}
