import { Injectable } from "@angular/core";
import { Skilltree } from "../models/Skilltree";
import { SkilltreeLoader } from "../data/SkilltreeLoader";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class SkilltreeLoaderService {

  constructor(private http: HttpClient) {
  }

  public loadSkilltrees() {
    return this.http.get("/api/skilltrees");
  }

  public loadSkilltree(data: any): Skilltree {
    return SkilltreeLoader.loadSkilltree(data);
  }
}
