import { Injectable } from "@angular/core";
import { Skilltree } from "../models/Skilltree";
import { SkilltreeLoader } from "../data/SkilltreeLoader";

@Injectable()
export class SkilltreeLoaderService {

  constructor() {
  }

  public loadSkilltree(data: any): Skilltree {
    return SkilltreeLoader.loadSkilltree(data);
  }
}
