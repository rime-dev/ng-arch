import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  Input,
  ViewChild,
} from '@angular/core';
import {MatDrawerMode, MatSidenav} from '@angular/material/sidenav';

export interface ShellLogo {
  src: string;
  alt?: string;
}
export interface Routes {
  path?: string;
  icon?: string;
  text?: string;
  children?: Routes[];
  opened?: boolean;
  divider?: boolean;
}
@Component({
  selector: 'rng-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent {
  public sidenavOpened = false;
  public fixedSidenavOpened = true;
  public sidenavMode: MatDrawerMode = 'side';
  public hasBackdrop = false;
  public isMobile = false;

  /**
   * Sets an elevation
   */
  @Input()
  set elevation(value: boolean) {
    this._elevation = value;
    this._changeDetectorRef.detectChanges();
  }
  get elevation(): boolean {
    return this._elevation;
  }
  private _elevation = true;

  /**
   * Defines the URL to render the main image
   */
  @Input()
  set logo(value: ShellLogo) {
    this._logo = value;
    this._changeDetectorRef.detectChanges();
  }
  get logo(): ShellLogo {
    return this._logo;
  }
  private _logo!: ShellLogo;

  /**
   * Defines the routes in the top navigation bar
   */
  @Input()
  set topRoutes(value: Routes[]) {
    this._topRoutes = value;
    this._changeDetectorRef.detectChanges();
  }
  get topRoutes(): Routes[] {
    return this._topRoutes;
  }
  private _topRoutes!: Routes[];
  /**
   * Defines the routes in the side navigation bar
   */
  @Input()
  set sideRoutes(value: Routes[]) {
    this._sideRoutes = value;
    this._changeDetectorRef.detectChanges();
  }
  get sideRoutes(): Routes[] {
    return this._sideRoutes;
  }
  private _sideRoutes!: Routes[];

  @ViewChild('sidenav') sidenav!: MatSidenav;

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth >= 1024) {
      this.sidenavMode = 'side';
      this.sidenavOpened = true;
      this.hasBackdrop = false;
      this.fixedSidenavOpened = true;
      this.isMobile = false;
    } else if (window.innerWidth >= 768) {
      this.sidenavMode = 'side';
      this.sidenavOpened = true;
      this.hasBackdrop = false;
      this.fixedSidenavOpened = false;
      this.isMobile = false;
    } else {
      this.sidenavMode = 'over';
      this.sidenavOpened = false;
      this.hasBackdrop = true;
      this.fixedSidenavOpened = true;
      this.isMobile = true;
    }
  }
  constructor(private _changeDetectorRef: ChangeDetectorRef) {
    this.onResize();
  }

  toggleFixedSidenav() {
    this.fixedSidenavOpened = !this.fixedSidenavOpened;
    this._changeDetectorRef.detectChanges();

    this.sidenav._container?.updateContentMargins();
  }
}
