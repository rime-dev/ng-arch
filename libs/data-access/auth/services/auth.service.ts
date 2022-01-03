import {Injectable, NgZone, OnDestroy} from '@angular/core';
import {GoogleAuthProvider} from '@angular/fire/auth';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/compat/firestore';
import {Router} from '@angular/router';
import firebase from 'firebase/compat';
import {BehaviorSubject, Subject} from 'rxjs';
import {User} from '../models/auth.model';

@Injectable({providedIn: 'root'})
export class AuthService implements OnDestroy {
  private destroy$: Subject<void> = new Subject();
  public user$: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

  constructor(
    public angularFirestore: AngularFirestore,
    private angularFireAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone
  ) {
    /* Saving user data in localstorage when
    logged in and setting up null when logged out */
    this.angularFireAuth.authState.subscribe((user) => {
      if (user) {
        this.user$.next(user as User);
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        this.user$.next(null);
        localStorage.setItem('user', String(null));
      }
    });
  }

  // Sign in with email/password
  signIn(email: string, password: string): Promise<void> {
    return this.angularFireAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        const user = result.user as User;
        if (user) {
          this.ngZone.run(() => {
            this.router.navigate(['/dashboard']);
            this.setUserData(user);
          });
        }
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  // Sign up with email/password
  signUp(email: string, password: string) {
    return this.angularFireAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        const user = result.user as User;
        if (user) {
          /* Call the SendVerificaitonMail() function when new user sign
          up and returns promise */
          this.sendVerificationMail();
          this.setUserData(user);
        }
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  // Send email verfificaiton when new user sign up
  public sendVerificationMail() {
    return this.angularFireAuth.currentUser
      .then((user) => user?.sendEmailVerification())
      .then(() => {
        this.router.navigate(['verify-email-address']);
      });
  }

  // Reset Forggot password
  public forgotPassword(passwordResetEmail: string) {
    return this.angularFireAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(String(localStorage.getItem('user')));
    return user !== null ? true : false;
  }

  // Returns true when user has a verified email
  get hasEmailVerified(): boolean {
    const user = JSON.parse(String(localStorage.getItem('user')));
    return user && user.emailVerified ? true : false;
  }
  // Sign in with Google
  public googleAuth() {
    return this.authLogin(new GoogleAuthProvider());
  }

  // Auth logic to run auth providers
  public authLogin(provider: firebase.auth.AuthProvider) {
    return this.angularFireAuth
      .signInWithPopup(provider)
      .then((result) => {
        if (result.user) {
          this.ngZone.run(() => {
            this.router.navigate(['dashboard']);
          });
          this.setUserData(result.user as User);
        }
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  /* Setting up user data when sign in with username/password,
  sign up with username/password and sign in with social auth
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  public setUserData(user: User) {
    const userRef: AngularFirestoreDocument<any> = this.angularFirestore.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }

  // Sign out
  public signOut() {
    return this.angularFireAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['sign-in']);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
