import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-dirty-form-onleave-dialog',
  templateUrl: './dirty-form-onleave-dialog.component.html',
  styleUrls: ['./dirty-form-onleave-dialog.component.scss']
})
export class DirtyFormOnleaveDialogComponent implements OnInit {
  public helperText = 'Do you want to save modifications before leaving this screen?';

  constructor(
    public matDialogRef: MatDialogRef<DirtyFormOnleaveDialogComponent>,
  ) { }

  ngOnInit(): void {
  }

}
