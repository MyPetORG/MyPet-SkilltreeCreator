import { Injectable } from "@angular/core";
import { Skilltree } from "../models/Skilltree";
import { SkilltreeLoader } from "../data/SkilltreeLoader";
import { Upgrade } from "../models/Upgrade";

@Injectable()
export class SkilltreeLoaderService {

  constructor() {
  }

  public loadSkilltree(data: any): { skilltree: Skilltree, upgrades: Upgrade[] } {
    return SkilltreeLoader.loadSkilltree(data);
  }
}
