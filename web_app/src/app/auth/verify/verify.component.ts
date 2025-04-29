import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../auth.service";

@Component({
    selector: 'app-verify',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './verify.component.html',
    styleUrl: './verify.component.css'
})
export class VerifyComponent implements OnInit {
    verificationCodeForm: FormGroup;
    resendCodeTimer: Number = 0;

    constructor(private router: Router, private authService: AuthService) {}

    ngOnInit() {
        this.verificationCodeForm = new FormGroup({});
        for (let i = 0; i < 6; i++) {
            this.verificationCodeForm.addControl(`${i}`, new FormControl("", [Validators.required, Validators.minLength(1), Validators.maxLength(1)]));
        }
        const resendCodeTimerDate = localStorage.getItem("resendCodeTimerDate");
        if (resendCodeTimerDate) {
            const expiresIn = new Date(resendCodeTimerDate).getTime() - new Date().getTime();
            if (expiresIn > 0){
                this.resendCodeTimer = expiresIn;
            } 
        } 
    }

    onCodeChange(index, event) {
        if (event.target.value.length == 0 && index > 0) {
            document.getElementById(`${index - 1}`).focus();
        }
        if (event.target.value.length == 1 && index < 5) {
            document.getElementById(`${index + 1}`).focus();
        }
        if (event.target.value.length == 2 ) {
            let value1 = event.target.value[0];
            let value2 = event.target.value[1];
            if (index < 4) {
                this.verificationCodeForm.controls[`${index}`].setValue(value1);
                this.verificationCodeForm.controls[`${index + 1}`].setValue(value2);
                for (let i = index + 2; i < 6; i++) {
                    this.verificationCodeForm.controls[`${i}`].setValue("");
                }
                document.getElementById(`${index + 2}`).focus();
            }
            if (index === 4) {
                this.verificationCodeForm.controls[`${index}`].setValue(value1);
                this.verificationCodeForm.controls[`${index + 1}`].setValue(value2);
                document.getElementById(`${index + 1}`).focus();
            }
            if (index === 5) {
                this.verificationCodeForm.controls[`${index}`].setValue(value1);
            }
        }
        if (event.target.value.length > 2) {
            let value = event.target.value;
            for (let i = index; i < 6; i++) {
                this.verificationCodeForm.controls[`${i}`].setValue(value[i-index]);
            }
        }
    }

    onVerify() {
        if(this.verificationCodeForm.valid) {
            console.log(this.verificationCodeForm.value);
            const code = Number(Object.values(this.verificationCodeForm.value).join(''));
            console.log(code);
            this.authService.verify(this.verificationCodeForm.value).subscribe({
                next: res => {
                    console.log(res);
                    this.router.navigate(['/home']);
                },
                error: err => {
                    console.log(err);
                }
            })
        }
    }

    resend() {
        this.authService.resendCode().subscribe({
            next: res => {
                console.log(res);
            },
            error: err => {
                console.log(err);
            }
        })
    }
}