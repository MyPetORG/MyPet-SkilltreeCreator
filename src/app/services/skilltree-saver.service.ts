import { Injectable } from "@angular/core";
import { Skilltree } from "../models/Skilltree";
import { HttpClient } from "@angular/common/http";
import { of } from "rxjs/observable/of";
import { SkilltreeSaver } from "../data/SkilltreeSaver";

@Injectable()
export class SkilltreeSaverService {

  constructor(private http: HttpClient) {
  }

  public saveSkilltrees(data: Skilltree[]) {
    let jsonSkilltrees = SkilltreeSaver.saveSkilltrees(data);
    return of("success");
    //return this.http.post("test", jsonSkilltrees);
  }
}
