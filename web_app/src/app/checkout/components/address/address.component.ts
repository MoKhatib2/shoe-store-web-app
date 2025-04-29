import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { address } from '../../../shared/models/user.model';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './address.component.html',
  styleUrl: './address.component.css'
})
export class AddressComponent implements OnInit, OnDestroy{
  @Output() next: EventEmitter<string> = new EventEmitter<string>();
  userAddress: address;
  editing: boolean = false;
  addressForm: FormGroup;
  userSub: Subscription;
  addAddressSub: Subscription;

  constructor(private authService: AuthService, private userService: UserService) {}

  ngOnInit(): void {
    this.addressForm = new FormGroup({
      city: new FormControl('', Validators.required),
      postCode: new FormControl('', Validators.required),
      streetName: new FormControl('', Validators.required),
      buildingNumber: new FormControl('', Validators.required),
      apartmentNumber: new FormControl('', Validators.required),
    })

    this.userSub = this.authService.userSubj.subscribe(user => {
      this.userAddress = user.address;
      if(!this.userAddress) {
        this.editing = true;
      } else {
        this.addressForm.setValue({
          city: this.userAddress.city,
          postCode: this.userAddress.postCode,
          streetName: this.userAddress.streetName,
          buildingNumber: this.userAddress.buildingNumber,
          apartmentNumber: this.userAddress.apartmentNumber,
          })
      }
    });
  }

  ngOnDestroy(): void {
      if(this.userSub) {
        this.userSub.unsubscribe();
      }
      if(this.addAddressSub) {
        this.addAddressSub.unsubscribe();
      }
  }

  onSubmit() {
    if(!this.addressForm.touched) {
      this.editing = false;
      return;
    }
    if(this.addressForm.valid) {
      this.userAddress = this.addressForm.value;
      this.addAddressSub = this.userService.addAddress(this.userAddress).subscribe({
        next: (res) => {
          this.editing = false;
        }
      })
    }
  }

  onNext() {
    this.next.emit('address');
  }
}
