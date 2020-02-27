import { A11yModule } from '@angular/cdk/a11y';
import { BidiModule } from '@angular/cdk/bidi';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SatPopoverAnchor } from './popover-anchor.directive';
import { PopoverAnchoringService } from './popover-anchoring.service';
import { SatPopover } from './popover.component';

@NgModule({
  imports: [
    CommonModule,
    OverlayModule,
    A11yModule,
    BidiModule,
  ],
  declarations: [
    SatPopover,
    SatPopoverAnchor,
  ],
  exports: [
    SatPopover,
    SatPopoverAnchor,
    BidiModule,
  ],
  providers: [
    PopoverAnchoringService,
  ],
})
export class SatPopoverModule {
}
