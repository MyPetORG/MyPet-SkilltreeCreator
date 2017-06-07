export class Skilltree {
  name: string;
  displayName: string;
  description: string[] = [];
  permission: string;
  skills = {};
  mobtypes = [];


  constructor(name: string, displayName: string, description: string[], permission: string) {
    this.name = name;
    this.displayName = displayName;
    this.description = description;
    this.permission = permission;
  }
}
