export interface Skilltree {
  id: string;
  name?: string;
  description?: string[];
  permission?: string;
  skills: { [name: string]: number[] };
  mobtypes: string[];
}
