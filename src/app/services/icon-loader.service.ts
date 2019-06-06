import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

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
    this.addSvgIcon('indeterminate_check_box', 'ic_indeterminate_check_box_24px.svg');
    this.addSvgIcon('check_box', 'ic_check_box_24px.svg');
    this.addSvgIcon('check_box_outline_blank', 'ic_check_box_outline_blank_24px.svg');
    this.addSvgIcon('cancel', 'ic_cancel_24px.svg');
    this.addSvgIcon('content_copy', 'ic_content_copy_24px.svg');
    this.addSvgIcon('drag_handle', 'ic_drag_handle_24px.svg');
    this.addSvgIcon('arrow_drop_down', 'ic_arrow_drop_down_24px.svg');
    this.addSvgIcon('delete', 'ic_delete_24px.svg');
    this.addSvgIcon('check', 'ic_check_24px.svg');
    this.addSvgIcon('translate', 'ic_translate_24px.svg');
    this.addSvgIcon('star', 'ic_star_24px.svg');
    this.addSvgIcon('exit_to_app', 'baseline-exit_to_app-24px.svg');
  }

  addSvgIcon(name: string, fileName: string) {
    this.iconRegistry.addSvgIcon(
      name,
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/img/material-icons/' + fileName));
  }
}
