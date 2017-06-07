import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Skilltree } from "../models/Skilltree";
import { Skill } from "../models/Skill";
import { Upgrade } from "../models/Upgrade";

@Injectable()
export class StateService {
  private _skilltree = new BehaviorSubject<Skilltree>(null);
  readonly skilltree: Observable<Skilltree> = this._skilltree.asObservable();

  private _skill = new BehaviorSubject<Skill<Upgrade>>(null);
  readonly skill: Observable<Skill<Upgrade>> = this._skill.asObservable();

  public selectSkilltree(skilltree: Skilltree) {
    this._skilltree.next(skilltree);
    this._skill.next(null);
  }

  public selectSkill(skill: Skill<Upgrade>) {
    this._skill.next(skill);
    console.log("selected NEW")
  }
}
