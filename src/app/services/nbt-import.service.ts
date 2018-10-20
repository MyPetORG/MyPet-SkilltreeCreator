import { Injectable } from '@angular/core';
import "pako";
import { Observable, Subscriber } from "rxjs";
import { NBT } from "../util/libs/nbt";

@Injectable()
export class NbtImportService {

  importFile(file): Observable<any> {
    let sub: Subscriber<any>;
    let observable: Observable<any> = new Observable<any>(subscriber => sub = subscriber);
    let reader = new FileReader();
    reader.onload = (event: any) => {
      let base64Data = event.currentTarget.result.split(',')[1];
      let data;
      try {
        data = window.atob(base64Data);
      } catch (e) {
        sub.error(e);
        return;
      }
      try {
        this.import(data, (d, e) => {
          if (e) {
            sub.error(e);
          } else {
            sub.next(d);
            sub.complete();
          }
        });
      } catch (e) {
        sub.error(e);
      }
    };
    reader.readAsDataURL(file);
    return observable;
  }

  import(data: any, callback: any) {
    data = this.base64ToArrayBuffer(data);
    NBT.parse(data, (e, d) => {
      callback(d, e);
    });
  }

  base64ToArrayBuffer(binary_string) {
    let len = binary_string.length;
    let bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }
}
