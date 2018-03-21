import { Upgrade } from "./upgrade";

export interface Skilltree {
  id: string;
  name?: string;
  order?: number
  icon?: string
  description?: string[];
  permission?: string;
  skills: { [name: string]: Upgrade[] };
  mobtypes: string[];
  requiredLevel?: number;
  maxLevel?: number;
}
