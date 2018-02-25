import { Upgrade } from "./Upgrade";

export interface Skilltree {
  id: string;
  name?: string;
  order?: number
  description?: string[];
  permission?: string;
  skills: { [name: string]: Upgrade[] };
  mobtypes: string[];
  requiredLevel?: number;
  maxLevel?: number;
}
