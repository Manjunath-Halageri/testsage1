import { Component, OnInit ,Input} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ValidationserviceService } from '../../services/validation.service';

@Component({
  selector: 'control-messages',
  templateUrl: './control-messages.component.html',
  styleUrls: ['./control-messages.component.css']
})
export class ControlMessagesComponent {

  
  @Input()
  public control: FormControl;

  constructor() {}

  get errorMessage(): boolean {
    for (const propertyName in this.control.errors) {
      if (this.control.errors.hasOwnProperty(propertyName) && (this.control.touched || this.control.dirty)) {
      
         return ValidationserviceService.getValidatorErrorMessage(
          propertyName,
          this.control.errors[propertyName]
        );
      }
    }

    return undefined;
  }
}
