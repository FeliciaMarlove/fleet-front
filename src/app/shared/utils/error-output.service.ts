import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {BlobStorageService} from '../../core/azure-services/blob-storage.service';

@Injectable({
  providedIn: 'root'
})
/**
 * Service for displaying error messages that writes logs to Azure blob log file
 */
export class ErrorOutputService {
  private snackBarRef;

  constructor(
    private matSnackBar: MatSnackBar,
    private azureBlobService: BlobStorageService
  ) { }

  /**
   * Show a snackbar with non blocking error
   * Write a log in Azure logs
   * @param componentName the name of the component where error was raised
   * @param message error message to output
   */
  public outputWarningInSnackbar(componentName: string, message: string) {
    this.snackBarRef = this.matSnackBar.open(message, 'OK', {
      panelClass: 'warning-snackbar'
    });
    this.snackBarRef.onAction().subscribe(() => {
      this.azureBlobService.writeAzureLogBlob('WARNING ' + componentName + ' ' + message);
    });
  }

  /**
   * Show a snackbar for block error
   * Write a log in Azure logs
   * @param componentName the name of the component where error was raised
   * @param message error message to output
   */
  public outputFatalErrorInSnackBar(componentName: string, message: string) {
    this.snackBarRef = this.matSnackBar.open('FATAL ERROR! ' + message, 'OK', {
      panelClass: 'fatal-snackbar'
    });
    this.snackBarRef.onAction().subscribe(() => {
      this.azureBlobService.writeAzureLogBlob('FATAL ' + componentName + ' ' + message);
    });
  }
}
