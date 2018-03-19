import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Skill } from "../models/skill";
import { Upgrade } from "../models/upgrade";

@Injectable()
export class StateService {
  private _skill = new BehaviorSubject<Skill<Upgrade>>(null);
  readonly skill: Observable<Skill<Upgrade>> = this._skill.asObservable();
}
