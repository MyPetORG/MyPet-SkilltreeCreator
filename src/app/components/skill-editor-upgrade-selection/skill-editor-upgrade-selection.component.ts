import { Component, OnInit } from "@angular/core";
import { StateService } from "../../services/state.service";

@Component({
  selector: 'app-skill-editor-upgrade-selection',
  templateUrl: './skill-editor-upgrade-selection.component.html',
  styleUrls: ['./skill-editor-upgrade-selection.component.scss']
})
export class SkillEditorUpgradeSelectionComponent implements OnInit {
  comp;
  nodes = [];

  constructor(private state: StateService) {
  }

  ngOnInit() {
    this.comp = 'fire';

    console.log("subscribe");
    this.state.skill.subscribe(skill => {
      console.log("Skill");
      console.log(skill);
      this.nodes = [];
      let id = 0;
      skill.upgrades.forEach(upgrade => {
        this.nodes.push({
          id: id++,
          name: "Test Test",//upgrade.rule,
          children: []
        })
      })
    })
  }

  /*
   {
   id: 1,
   name: 'root1',
   children: [
   {id: 2, name: 'child1'},
   {id: 3, name: 'child2'}
   ]
   },
   {
   id: 4,
   name: 'root2',
   children: [
   {id: 5, name: 'child2.1'},
   {
   id: 6,
   name: 'child2.2',
   children: [
   {id: 7, name: 'subsub'}
   ]
   }
   ]
   }
   */
}
