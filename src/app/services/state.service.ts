import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Skill } from "../models/Skill";
import { Upgrade } from "../models/Upgrade";

@Injectable()
export class StateService {
  private _skill = new BehaviorSubject<Skill<Upgrade>>(null);
  readonly skill: Observable<Skill<Upgrade>> = this._skill.asObservable();
}
