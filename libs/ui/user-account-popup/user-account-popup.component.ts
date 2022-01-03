import {Component, Input} from '@angular/core';

export interface Routes {
  path?: string;
  icon?: string;
  text?: string;
  click?: unknown;
}

export interface UserInfo {
  displayName?: string;
  email?: string;
  photoUrl?: string;
  uid?: string;
}

@Component({
  selector: 'rng-user-account-popup',
  templateUrl: './user-account-popup.component.html',
  styleUrls: ['./user-account-popup.component.scss'],
})
export class UserAccountPopupComponent {
  /**
   * Defines the routes in the menu
   */
  @Input()
  set routes(value: Routes[]) {
    this._routes = value;
  }
  get routes(): Routes[] {
    return this._routes;
  }
  private _routes!: Routes[];
  /**
   * Defines the user information
   */
  @Input()
  set userInfo(value: UserInfo | null) {
    this._userInfo = value;
  }
  get userInfo(): UserInfo | null {
    return this._userInfo;
  }
  private _userInfo!: UserInfo | null;
  constructor() {}
  handleClickEvent(event: any) {
    event();
  }
}
