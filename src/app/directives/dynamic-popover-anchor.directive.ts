import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewContainerRef
} from '@angular/core';
import { merge, Subject } from "rxjs";
import { takeUntil, tap } from 'rxjs/operators';
import { PopoverAnchoringService } from "../util/popover/popover-anchoring.service";
import { SatPopover } from "../util/popover/popover.component";

@Directive({
  selector: '[stcDynamicPopoverAnchorFor]',
  exportAs: 'stcDynamicPopoverAnchor',
  providers: [PopoverAnchoringService],
})
export class DynamicPopoverAnchorDirective implements OnInit, OnDestroy {

  /** Reference to the popover instance. */
  @Input('stcDynamicPopoverAnchorFor')
  get attachedPopover() {
    return this._attachedPopover;
  }

  set attachedPopover(value: SatPopover) {
    this._validateAttachedPopover(value);
    this._attachedPopover = value;
    // Anchor the popover to the element ref
  }

  private _attachedPopover: SatPopover;

  /** Emits when the popover is opened. */
  @Output() popoverOpened = new EventEmitter<void>();

  /** Emits when the popover is closed. */
  @Output() popoverClosed = new EventEmitter<any>();

  /** Gets whether the popover is presently open. */
  isPopoverOpen(): boolean {
    return this._anchoring.isPopoverOpen();
  }

  /** Emits when the directive is destroyed. */
  private _onDestroy = new Subject<void>();

  constructor(
    private _elementRef: ElementRef,
    private _viewContainerRef: ViewContainerRef,
    public _anchoring: PopoverAnchoringService,
  ) {
  }

  ngOnInit() {
    // Re-emit open and close events
    const opened$ = this._anchoring.popoverOpened
      .pipe(tap(() => this.popoverOpened.emit()));
    const closed$ = this._anchoring.popoverClosed
      .pipe(tap(value => this.popoverClosed.emit(value)));
    merge(opened$, closed$).pipe(takeUntil(this._onDestroy)).subscribe();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  @HostListener('click', ['$event']) onClick($event) {
    this.togglePopover();
  }

  /** Toggles the popover between the open and closed states. */
  togglePopover(): void {
    this._anchoring.anchor(this.attachedPopover, this._viewContainerRef, this._elementRef);
    this._anchoring.togglePopover();
  }

  /** Opens the popover. */
  openPopover(): void {
    this._anchoring.anchor(this.attachedPopover, this._viewContainerRef, this._elementRef);
    this._anchoring.openPopover();
  }

  /** Closes the popover. */
  closePopover(value?: any): void {
    this._anchoring.closePopover(value);
  }

  /** Throws an error if the popover instance is not provided. */
  private _validateAttachedPopover(popover: SatPopover): void {
    if (!popover || !(popover instanceof SatPopover)) {
      throw Error('SatPopoverAnchor must be provided an SatPopover component instance.');
    }
  }

}
