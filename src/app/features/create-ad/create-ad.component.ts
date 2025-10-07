import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Ad, AdCategory, AdStatus } from '../../models/ad.interface';

@Component({
  selector: 'app-create-ad',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './create-ad.component.html',
  styleUrl: './create-ad.component.css',
})
export class CreateAdComponent implements OnInit {
  // ==========================================
  // PROPRIETÀ DEL COMPONENTE
  // ==========================================

  // Form reattivo di Angular
  adForm: FormGroup;

  // Controllo del flusso multi-step
  currentStep = 1;

  // Dati per le opzioni del form
  categories = [
    { value: AdCategory.SERVICES, label: 'Servicios', icon: '🔧' },
    { value: AdCategory.ELECTRONICS, label: 'Electrónicos', icon: '📱' },
    { value: AdCategory.HOUSEHOLD, label: 'Hogar', icon: '🏠' },
    { value: AdCategory.CLOTHING, label: 'Ropa', icon: '👕' },
    { value: AdCategory.TRANSPORT, label: 'Transporte', icon: '🚗' },
    { value: AdCategory.FOOD, label: 'Alimentos', icon: '🍽️' },
    { value: AdCategory.HEALTH, label: 'Salud', icon: '🏥' },
    { value: AdCategory.EDUCATION, label: 'Educación', icon: '📚' },
    { value: AdCategory.CONSTRUCTION, label: 'Construcción', icon: '🔨' },
    { value: AdCategory.OTHER, label: 'Otros', icon: '📦' },
  ];

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

  // Gestione dei tag
  selectedTags: string[] = [];
  newTag = '';

  // Gestione del prezzo
  priceType: 'free' | 'exchange' | 'paid' = 'free';
  exchangeDetails = '';

  // Gestione delle foto
  uploadedPhotos: any[] = [];

  // Stati dell'interfaccia
  isSubmitting = false;
  showSuccessModal = false;

  // Riferimento al enum per il template
  AdCategory = AdCategory;

  constructor(private formBuilder: FormBuilder, private router: Router) {
    // Inizializziamo il form reattivo con tutte le validazioni
    this.adForm = this.formBuilder.group({
      type: ['', Validators.required],
      category: ['', Validators.required],
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(100),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(20),
          Validators.maxLength(500),
        ],
      ],
      province: ['', Validators.required],
      city: ['', Validators.required],
      price: [null],
      currency: ['CUP'],
      negotiable: [false],
    });
  }

  // ==========================================
  // METODI DEL CICLO DI VITA
  // ==========================================

  ngOnInit() {
    // Inizializzazione del componente
    console.log('Componente create-ad inizializzato');
  }

  // ==========================================
  // METODI PER LA NAVIGAZIONE TRA STEP
  // ==========================================

  nextStep() {
    if (this.canProceedToNextStep()) {
      this.currentStep++;
      this.scrollToTop();
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.scrollToTop();
    }
  }

  private canProceedToNextStep(): boolean {
    switch (this.currentStep) {
      case 1:
        return this.isStep1Valid();
      case 2:
        return this.isStep2Valid();
      case 3:
        return this.isStep3Valid();
      default:
        return true;
    }
  }

  private scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ==========================================
  // VALIDAZIONI PER OGNI STEP
  // ==========================================

  isStep1Valid(): boolean {
    return (
      (this.adForm.get('type')?.valid ?? false) &&
      (this.adForm.get('category')?.valid ?? false)
    );
  }

  isStep2Valid(): boolean {
    return (
      (this.adForm.get('title')?.valid ?? false) &&
      (this.adForm.get('description')?.valid ?? false) &&
      (this.adForm.get('province')?.valid ?? false) &&
      (this.adForm.get('city')?.valid ?? false)
    );
  }

  isStep3Valid(): boolean {
    if (this.priceType === 'paid') {
      return this.adForm.get('price')?.value > 0;
    }
    return true; // Free e exchange sono sempre validi
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.adForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  // ==========================================
  // GESTIONE SELEZIONI STEP 1
  // ==========================================

  selectAdType(type: 'offer' | 'request') {
    this.adForm.patchValue({ type });
  }

  selectCategory(category: AdCategory) {
    this.adForm.patchValue({ category });
  }

  // ==========================================
  // GESTIONE LOCALITÀ
  // ==========================================

  onProvinceChange() {
    // Reset della città quando cambia la provincia
    this.adForm.patchValue({ city: '' });
  }

  // ==========================================
  // GESTIONE DEI TAG
  // ==========================================

  addTag(event: Event) {
    event.preventDefault();
    const tag = this.newTag.trim().toLowerCase();

    if (
      tag &&
      !this.selectedTags.includes(tag) &&
      this.selectedTags.length < 8
    ) {
      this.selectedTags.push(tag);
      this.newTag = '';
    }
  }

  removeTag(index: number) {
    this.selectedTags.splice(index, 1);
  }

  addSuggestedTag(tag: string) {
    if (!this.selectedTags.includes(tag) && this.selectedTags.length < 8) {
      this.selectedTags.push(tag);
    }
  }

  getTagSuggestions(): string[] {
    const category = this.adForm.get('category')?.value;
    const suggestions: { [key: string]: string[] } = {
      [AdCategory.ELECTRONICS]: ['smartphone', 'nuevo', 'garantía', 'original'],
      [AdCategory.SERVICES]: [
        'profesional',
        'experiencia',
        'rápido',
        'domicilio',
      ],
      [AdCategory.HOUSEHOLD]: ['como nuevo', 'funciona', 'mudanza', 'poco uso'],
      [AdCategory.TRANSPORT]: [
        'papeles',
        'mecánica',
        'combustible',
        'revisión',
      ],
      [AdCategory.CLOTHING]: ['talla', 'nuevo', 'marca', 'temporada'],
      [AdCategory.FOOD]: ['fresco', 'casero', 'natural', 'entrega'],
      [AdCategory.EDUCATION]: [
        'certificado',
        'experiencia',
        'online',
        'presencial',
      ],
      [AdCategory.HEALTH]: ['natural', 'efectivo', 'recomendado', 'seguro'],
      [AdCategory.CONSTRUCTION]: [
        'calidad',
        'instalación',
        'garantía',
        'profesional',
      ],
      [AdCategory.OTHER]: ['único', 'especial', 'raro', 'colección'],
    };

    return (
      suggestions[category] || [
        'barato',
        'buena calidad',
        'negociable',
        'urgente',
      ]
    );
  }

  // ==========================================
  // GESTIONE PREZZO
  // ==========================================

  setPriceType(type: 'free' | 'exchange' | 'paid') {
    this.priceType = type;

    if (type === 'free' || type === 'exchange') {
      this.adForm.patchValue({ price: null });
    }
  }

  getAdTypeText(): string {
    const type = this.adForm.get('type')?.value;
    return type === 'offer' ? 'producto/servicio' : 'búsqueda';
  }

  // ==========================================
  // GESTIONE FOTO
  // ==========================================

  triggerFileInput() {
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onPhotosSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (files) {
      Array.from(files).forEach((file) => {
        if (this.uploadedPhotos.length < 5 && this.isValidImage(file)) {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.uploadedPhotos.push({
              file: file,
              preview: e.target?.result as string,
            });
          };
          reader.readAsDataURL(file);
        }
      });

      // Reset dell'input per permettere di selezionare di nuovo gli stessi file
      input.value = '';
    }
  }

  private isValidImage(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      alert('Solo sono accettati file JPEG, PNG o WebP');
      return false;
    }

    if (file.size > maxSize) {
      alert('Il file è troppo grande. Massimo 5MB per foto.');
      return false;
    }

    return true;
  }

  removePhoto(index: number) {
    this.uploadedPhotos.splice(index, 1);
  }

  // ==========================================
  // UTILITÀ PER LA FORMATTAZIONE
  // ==========================================

  truncateText(text: string, maxLength: number): string {
    if (!text || text.length <= maxLength) {
      return text || '';
    }
    return text.substring(0, maxLength) + '...';
  }

  // ==========================================
  // INVIO DEL FORM
  // ==========================================

  async submitAd() {
    if (!this.adForm.valid) {
      this.markFormGroupTouched();
      return;
    }

    this.isSubmitting = true;

    try {
      // Prepariamo i dati dell'annuncio
      const adData = this.prepareAdData();

      // Simuliamo l'invio al server (in una app reale useresti un servizio)
      await this.simulateApiCall(adData);

      // Mostriamo il modal di successo
      this.showSuccessModal = true;
    } catch (error) {
      console.error('Errore durante la pubblicazione:', error);
      alert('Si è verificato un errore durante la pubblicazione. Riprova.');
    } finally {
      this.isSubmitting = false;
    }
  }

  private prepareAdData(): Partial<Ad> {
    const formValue = this.adForm.value;

    return {
      title: formValue.title,
      description: formValue.description,
      category: formValue.category,
      type: formValue.type,
      price: this.priceType === 'paid' ? formValue.price : undefined,
      currency: formValue.currency,
      location: {
        province: formValue.province,
        city: formValue.city,
      },
      tags: this.selectedTags,
      // In una app reale, qui uploaderesti le foto e otterresti gli URL
      images: this.uploadedPhotos.map((photo) => photo.preview),
      status: AdStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 giorni
      viewCount: 0,
      contactCount: 0,
    };
  }

  private async simulateApiCall(adData: Partial<Ad>): Promise<void> {
    // Simuliamo una chiamata API con un delay
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Annuncio creato:', adData);
        resolve();
      }, 2000);
    });
  }

  private markFormGroupTouched() {
    Object.keys(this.adForm.controls).forEach((key) => {
      const control = this.adForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  // ==========================================
  // GESTIONE MODAL DI SUCCESSO
  // ==========================================

  closeSuccessModal() {
    this.showSuccessModal = false;
    this.router.navigate(['/home']);
  }

  createAnother() {
    this.showSuccessModal = false;
    this.resetForm();
  }

  goToMyAds() {
    this.showSuccessModal = false;
    this.router.navigate(['/profile']);
  }

  private resetForm() {
    this.adForm.reset();
    this.currentStep = 1;
    this.selectedTags = [];
    this.uploadedPhotos = [];
    this.priceType = 'free';
    this.exchangeDetails = '';
    this.newTag = '';

    // Resettiamo i valori di default
    this.adForm.patchValue({
      currency: 'CUP',
      negotiable: false,
    });
  }

  // ==========================================
  // NAVIGAZIONE
  // ==========================================

  goBack() {
    if (this.currentStep > 1) {
      this.previousStep();
    } else {
      this.router.navigate(['/home']);
    }
  }
}
