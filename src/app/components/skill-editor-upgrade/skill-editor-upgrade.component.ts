import { Component, Input } from "@angular/core";

@Component({
  selector: 'app-skill-editor-upgrade',
  templateUrl: './skill-editor-upgrade.component.html',
  styleUrls: ['./skill-editor-upgrade.component.scss']
})
export class SkillEditorUpgradeComponent {
  @Input() skill;
}
