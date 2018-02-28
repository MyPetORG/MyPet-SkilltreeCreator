import { Skilltree } from "../models/Skilltree";

export class SkilltreeSaver {

  static saveSkilltrees(skilltrees: Skilltree[]): any {
    console.log("save skilltrees:", skilltrees);
    return {skilltrees}; //TODO
  }
}
