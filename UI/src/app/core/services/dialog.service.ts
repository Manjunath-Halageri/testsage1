import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MatConfirmDialogComponent } from '../mat-confirm-dialog/mat-confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(private dialog: MatDialog) { }

  openConfirmDialog(msg) {
    return this.dialog.open(MatConfirmDialogComponent, {
      width: '400px',
      height: '130px',
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      data: {
        message: msg,
      }
    });
  }

  ReusableDialog(msg) {
    return this.dialog.open(MatConfirmDialogComponent, {
      width: '400px',
      height: '150px',
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      data: {
        message: msg,
      }
    });
  }

  ReusableDialog2(msg) {
    return this.dialog.open(MatConfirmDialogComponent, {
      width: '400px',
      height: '130px',
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      data: {
        message: msg,
      }
    });
  }

  nlpDialog(msg) {
    return this.dialog.open(MatConfirmDialogComponent, {
      width: '400px',
      height: '130px',
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      data: {
        message: msg,
      }
    });
  }

  scheduleDialog(msg) {
    return this.dialog.open(MatConfirmDialogComponent, {
      width: '400px',
      height: '130px',
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      data: {
        message: msg,
      }
    });
  }

  dockerDialog(msg) {
    return this.dialog.open(MatConfirmDialogComponent, {
      width: '400px',
      height: '130px',
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      data: {
        message: msg,
      }
    });
  }

  test_executionDialog(msg) {
    return this.dialog.open(MatConfirmDialogComponent, {
      width: '400px',
      height: '130px',
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      data: {
        message: msg,
      }
    });
  }

  openAlert(msg) {
    return this.dialog.open(MatConfirmDialogComponent, {
      width: '400px',
      height: '130px',
      panelClass: 'confirm-dialog-container',
      data: {
        message: msg,
        alert: true
      }
    });
  }
}
