import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class DecoratorService {
  constructor(private _snackbar:MatSnackBar) { }
  trail(){
  
  }
  saveSnackbar(message: string, action: string, className: string) {
    this._snackbar.open(message, action, {
      duration: 5000,
      verticalPosition: 'bottom',
      horizontalPosition: 'end',
      panelClass: [className]
    });
  }

  update_Snackbar(message: string, action: string, className: string) {
    this._snackbar.open(message, action, {
      duration: 5000,
      verticalPosition: 'bottom',
      horizontalPosition: 'end',
      panelClass: [className]
    });
  }

  create_Snackbar(message: string, action: string, className: string) {
    this._snackbar.open(message, action, {
      duration: 5000,
      verticalPosition: 'bottom',
      horizontalPosition: 'end',
      panelClass: [className]
    });
  }

  duplicate_Snackbar(message: string, action: string, className: string) {
    this._snackbar.open(message, action, {
      duration: 5000,
      verticalPosition: 'bottom',
      horizontalPosition: 'end',
      panelClass: [className]
    });
  }
  dockerSnackbar(message: string, action: string, className: string) {
    this._snackbar.open(message, action, {
      duration: 5000,
      verticalPosition: 'bottom',
      horizontalPosition: 'end',
      panelClass: [className]
    });
  }

  copySnackbar(message: string, action: string, className: string) {
    this._snackbar.open(message, action, {
      duration: 5000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      panelClass: [className]
    });
  }
}
