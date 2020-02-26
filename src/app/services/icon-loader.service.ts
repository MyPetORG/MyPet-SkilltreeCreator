import { Injectable } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faCopy, faEdit } from '@fortawesome/free-regular-svg-icons';
import {
  faArrowLeft,
  faBars,
  faCaretDown,
  faCheck,
  faCloudUploadAlt,
  faDoorOpen,
  faFileImport,
  faGripLines,
  faInfo,
  faInfoCircle,
  faLanguage,
  faRedo,
  faSave,
  faTimes,
  faTrash,
  faUndo,
} from '@fortawesome/free-solid-svg-icons';

@Injectable()
export class IconLoaderService {

  constructor(
    private library: FaIconLibrary,
  ) {
  }

  load() {
    const icons = [
      faArrowLeft,
      faInfo,
      faInfoCircle,
      faBars,
      faUndo,
      faRedo,
      faCloudUploadAlt,
      faSave,
      faEdit,
      faTimes,
      faCopy,
      faGripLines,
      faCaretDown,
      faTrash,
      faCheck,
      faLanguage,
      faDoorOpen,
      faFileImport,
    ];
    this.library.addIcons(...icons);
  }
}
