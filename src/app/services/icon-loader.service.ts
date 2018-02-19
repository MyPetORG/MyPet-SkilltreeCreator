import { Injectable } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";
import { MatIconRegistry } from "@angular/material";

@Injectable()
export class IconLoaderService {

  constructor(private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {
  }

  load() {
    this.addSvgIcon('arrow_back', 'ic_arrow_back_24px.svg');
    this.addSvgIcon('info_outline', 'ic_info_outline_24px.svg');
    this.addSvgIcon('menu', 'ic_menu_24px.svg');
    this.addSvgIcon('redo', 'ic_redo_24px.svg');
    this.addSvgIcon('undo', 'ic_undo_24px.svg');
    this.addSvgIcon('cloud_upload', 'ic_cloud_upload_24px.svg');
    this.addSvgIcon('input', 'ic_input_24px.svg');
    this.addSvgIcon('save', 'ic_save_24px.svg');
    this.addSvgIcon('create', 'ic_create_24px.svg');
  }

  addSvgIcon(name: string, fileName: string) {
    this.iconRegistry.addSvgIcon(
      name,
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/img/material-icons/' + fileName));
  }
}
