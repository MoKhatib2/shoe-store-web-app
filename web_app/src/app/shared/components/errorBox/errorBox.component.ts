import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

@Component({
    standalone: true,
    imports: [CommonModule, FontAwesomeModule],
    selector: 'app-error-box',
    templateUrl: './errorBox.component.html',
    styleUrls: ['./errorBox.component.css']
})
export class ErrorBoxComponent {
    @Input() errorMessage: string;
    @Input() boxWidth?: string;
    @Input() boxHeight?: string;
    faExclamationCircle = faExclamationCircle;
}