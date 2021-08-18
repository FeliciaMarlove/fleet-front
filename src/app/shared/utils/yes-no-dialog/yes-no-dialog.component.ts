import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-dirty-form-onleave-dialog',
  templateUrl: './yes-no-dialog.component.html',
  styleUrls: ['./yes-no-dialog.component.scss']
})
/**
 * Generic dialog with yes/no option
 */
export class YesNoDialogComponent implements OnInit {

  constructor(
    public matDialogRef: MatDialogRef<YesNoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {helperText: string}
  ) { }

  ngOnInit(): void {
  }

}
