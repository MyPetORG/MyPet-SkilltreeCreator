import { Component, OnInit, ViewChild } from "@angular/core";
import { MdDialog } from "@angular/material";
import { StateService } from "../../../services/state.service";
import { UpgradeAddDialogComponent } from "../../upgrade-add-dialog/upgrade-add-dialog.component";
import { Fire } from "../../../models/skills/Fire";
import { Skill } from "../../../models/Skill";
import { TreeComponent } from "angular-tree-component";
import { LevelRule } from "../../../models/LevelRule";

@Component({
  selector: 'app-fire-skill',
  templateUrl: './fire-skill.component.html',
  styleUrls: ['./fire-skill.component.scss']
})
export class FireSkillComponent implements OnInit {

  @ViewChild(TreeComponent)
  private tree: TreeComponent;

  nodes = [];
  skill: Skill = null;

  constructor(private state: StateService,
              private dialog: MdDialog) {
  }

  ngOnInit() {
    this.state.skill.subscribe((skill) => {
      this.nodes = [];
      this.skill = skill;

      skill.upgrades.forEach(upgrade => {
        let fireUpgrade = upgrade as Fire;

        this.nodes.push({
          name: LevelRule.toString(upgrade.rule),
          isExpanded: true,
          children: [
            {
              type: 'chance',
              skillData: fireUpgrade.chance
            }, {
              type: 'duration',
              skillData: fireUpgrade.duration
            }
          ]
        })
      });
    })
  }

  addUpgrade() {
    console.log("clicked FAB");
    let dialogRef = this.dialog.open(UpgradeAddDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let fireUpgrade = new Fire();
        fireUpgrade.rule = result;
        this.skill.upgrades.push(fireUpgrade);

        this.nodes.push({
          name: LevelRule.toString(result),
          isExpanded: true,
          children: [
            {
              type: 'chance',
              skillData: fireUpgrade.chance
            }, {
              type: 'duration',
              skillData: fireUpgrade.duration
            }
          ]
        });

        this.tree.treeModel.update();
      }
    });
  }

  options = {
    allowDrag: function (node) {
      return node.isRoot;
    },
    allowDrop: function (node) {
      return !node || !node.isRoot;
    },
    animateExpand: true
  };
}
