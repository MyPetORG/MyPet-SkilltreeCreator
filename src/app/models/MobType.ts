import { Skilltree } from "./Skilltree";

export class MobType {
  name: string;
  skilltrees: Skilltree[] = [];

  constructor(name: string) {
    this.name = name;
  }
}

