import {Component, OnInit} from '@angular/core';
import {AngularFireFunctions} from '@angular/fire/compat/functions';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AuthService, User as UserAuth} from '@rng/data-access/auth';
import {DataService} from '@rng/data-access/base';
import {EntityState} from '@rng/data-access/base/models/base.model';
import {UserInfo} from '@rng/ui/user-account-popup';
import {Observable} from 'rxjs';
import {Activity} from '../../models/activity.model';

@Component({
  selector: 'rng-services-web',
  templateUrl: './services-web.component.html',
  styleUrls: ['./services-web.component.scss'],
})
export class ServicesWebComponent implements OnInit {
  public appName = 'E-LARES';
  public logo = {
    src: 'assets/rng-logo.png',
    alt: 'E-LARES',
  };
  public topRoutes = [];
  public activities$!: Observable<EntityState<Activity>[] | null>;
  public requestServiceForm: FormGroup;
  public userRoutes = [
    {
      click: async () => {
        await this.authService.signOut();
      },
      text: 'Logout',
      icon: 'logout',
    },
  ];
  public sendRequestLoading = false;
  public user$!: Observable<UserInfo | null>;
  public userAuth$: Observable<UserAuth | null>;

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private matSnackBar: MatSnackBar,
    private angularFireFunctions: AngularFireFunctions
  ) {
    this.requestServiceForm = new FormGroup({
      activity: new FormControl('', Validators.required),
      location: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
    });
    this.userAuth$ = this.authService.user$;
  }

  ngOnInit(): void {
    this.activities$ = this.dataService.select<Activity>('Activity').entities$;
    this.dataService.select<Activity>('Activity').getAll();
  }
  sendRequest() {
    if (!this.requestServiceForm.valid) {
      this.matSnackBar.open('Formulario inválido', '', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      return;
    }
    const email = this.requestServiceForm.controls.email.value as string;
    const activity = this.requestServiceForm.controls.activity.value as string;
    const location = this.requestServiceForm.controls.location.value as string;
    const to = 'info@e-lares.com';
    const subject = 'Solicitud de servicio de ' + email + '';
    const body = `Se solicita ${activity} para el CP ${location}`;
    this.sendRequestLoading = true;
    const sendMail = this.angularFireFunctions.httpsCallable('sendMail');
    sendMail({name: email, from: email, to: to, subject: subject, body: body, section: 'info'})
      .toPromise()
      .then(() => {
        this.sendRequestLoading = false;
        this.matSnackBar.open('Solicitud enviada', '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      })
      .catch((err) => {
        this.sendRequestLoading = false;
        console.error(err);
      });
  }
}
