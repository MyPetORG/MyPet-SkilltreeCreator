import { Injectable } from "@angular/core";
import { Skilltree } from "../models/Skilltree";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class SkilltreeSaverService {

  constructor(private http: HttpClient) {
  }

  public saveSkilltrees(data: Skilltree[]) {
    //TODO implement and add skilltree saver
    return this.http.post("/api/skilltrees/save", data);
  }
}
