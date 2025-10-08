import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  currentStep = 1;
  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;
  errorMessage = '';

  provinces = [
    'Pinar del Río',
    'Artemisa',
    'La Habana',
    'Mayabeque',
    'Matanzas',
    'Cienfuegos',
    'Villa Clara',
    'Sancti Spíritus',
    'Ciego de Ávila',
    'Camagüey',
    'Las Tunas',
    'Holguín',
    'Granma',
    'Santiago de Cuba',
    'Guantánamo',
    'Isla de la Juventud',
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.pattern(/^[a-zA-Z0-9_-]+$/),
          ],
        ],
        displayName: ['', [Validators.required, Validators.minLength(2)]],
        province: ['', Validators.required],
        city: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
        acceptTerms: [false, Validators.requiredTrue],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value
      ? null
      : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched(this.registerForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register(this.registerForm.value).subscribe({
      next: (response) => {
        console.log('Registro exitoso', response);
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage =
          error.message || 'Error al crear la cuenta. Inténtalo de nuevo.';
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  nextStep(): void {
    if (this.canProceedToNextStep()) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  canProceedToNextStep(): boolean {
    if (this.currentStep === 1) {
      return !!(
        this.registerForm.get('email')?.valid &&
        this.registerForm.get('username')?.valid &&
        this.registerForm.get('displayName')?.valid
      );
    }
    if (this.currentStep === 2) {
      return !!(
        this.registerForm.get('province')?.valid &&
        this.registerForm.get('city')?.valid
      );
    }
    return false;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  get passwordStrength(): string {
    const password = this.registerForm.get('password')?.value || '';

    if (password.length < 8) return 'weak';

    let strength = 0;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;

    if (strength <= 2) return 'weak';
    if (strength === 3) return 'medium';
    return 'strong';
  }

  getPasswordStrengthText(): string {
    const strength = this.passwordStrength;
    if (strength === 'weak') return 'Débil';
    if (strength === 'medium') return 'Media';
    return 'Fuerte';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }
}
