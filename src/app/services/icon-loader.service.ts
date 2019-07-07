import { Injectable } from '@angular/core';
import { library } from '@fortawesome/fontawesome-svg-core';
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
  faUndo
} from '@fortawesome/free-solid-svg-icons';

@Injectable()
export class IconLoaderService {

  load() {
    library.add(faArrowLeft);
    library.add(faInfo);
    library.add(faInfoCircle);
    library.add(faBars);
    library.add(faUndo);
    library.add(faRedo);
    library.add(faCloudUploadAlt);
    library.add(faSave);
    library.add(faEdit);
    library.add(faTimes);
    library.add(faCopy);
    library.add(faGripLines);
    library.add(faCaretDown);
    library.add(faTrash);
    library.add(faCheck);
    library.add(faLanguage);
    library.add(faDoorOpen);
    library.add(faFileImport);
  }
}
