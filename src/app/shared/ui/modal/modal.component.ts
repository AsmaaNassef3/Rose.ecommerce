import {
  AfterViewInit,
  Component,
  inject,
  signal,
  WritableSignal,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import * as L from 'leaflet';
import { Address, Addresses } from '../../interfaces/Addresses/addresses';
import { AddressesService } from '../../../core/services/Addresses/addresses.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent implements AfterViewInit, OnDestroy ,OnInit{
  private readonly addressesService = inject(AddressesService);
  private readonly formBuilder = inject(FormBuilder);
  private userLat: number | null = null;
  private userLng: number | null = null;
  private map: L.Map | null = null;
  private marker: L.Marker | null = null;
  totalUserAddresses: WritableSignal<Address[] | null> = signal([]);
  isSubmitting = false;

  addressForm: FormGroup = this.formBuilder.group({
    username: ['', [Validators.required, Validators.pattern(/^[A-Za-z][a-zA-Z\s]{2,19}$/)]],
    city: ['', [Validators.required, Validators.minLength(2)]],
    street: ['', [Validators.required, Validators.minLength(3)]],
    phone: ['', [Validators.required, Validators.pattern(/^01[0-9]{9}$/)]],
  });

  modalStep = signal(1);
  userAddresses: WritableSignal<Addresses[] | null> = signal(null);


  backToList() {
    this.modalStep.set(1);
    this.destroyMap();
    this.addressForm.reset();
    this.loadUserAddresses();
  }

  goToForm() {
    this.modalStep.set(2);
    this.addressForm.reset();

    // ننتظر حتى يتم render الDOM
    setTimeout(() => {
      this.getUserLocation().then(({ lat, lng }) => {
        this.initMap(lat, lng);
      });
    }, 100);
  }

  private getUserLocation(): Promise<{ lat: number; lng: number }> {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            this.userLat = lat;
            this.userLng = lng;
            console.log('User location obtained:', { lat, lng });
            resolve({ lat, lng });
          },
          (error) => {
            console.error('Error getting user location:', error);
            // Cairo coordinates as fallback
            const lat = 30.033333;
            const lng = 31.233334;
            this.userLat = lat;
            this.userLng = lng;
            resolve({ lat, lng });
          }
        );
      } else {
        console.error('Geolocation not supported');
        const lat = 30.033333;
        const lng = 31.233334;
        this.userLat = lat;
        this.userLng = lng;
        resolve({ lat, lng });
      }
    });
  }



loadUserAddresses(): void {
    this.addressesService.getLogedInUserAddress().subscribe({
      next: (response: any) => {
        console.log('Addresses loaded:', response);
    
        this.totalUserAddresses.set(response.addresses);
        console.log('Total user addresses:', this.totalUserAddresses());
      },
      error: (error) => {
        console.error('Error loading addresses:', error);
        this.totalUserAddresses.set([]);
      }
    });
  }

  private initMap(lat: number, lng: number): void {
    this.destroyMap();

    // Wait for the map container to be available
    setTimeout(() => {
      const mapContainer = document.getElementById('map');
      if (!mapContainer) {
        console.error('Map container not found');
        return;
      }

      this.map = L.map('map').setView([lat, lng], 17);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
      }).addTo(this.map);

      this.marker = L.marker([lat, lng])
        .addTo(this.map)
        .bindPopup('You are here 📍')
        .openPopup();

      // Update coordinates when map is clicked
      this.map.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
        this.userLat = lat;
        this.userLng = lng;
        
        if (this.marker) {
          this.marker.setLatLng([lat, lng]);
        }
        
        console.log('New location selected:', { lat, lng });
      });

      // Resize map after it's loaded
      setTimeout(() => {
        if (this.map) {
          this.map.invalidateSize();
        }
      }, 200);
    }, 50);
  }

  private destroyMap(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
      this.marker = null;
    }
  }

  selectAddress(address: Addresses): void {
    console.log('Address selected:', address);
    // Handle address selection logic here
    // For example, emit to parent component or close modal
    const modal = document.getElementById('my_modal_4') as HTMLDialogElement;
    if (modal) modal.close();
  }

  submitForm(): void {
    console.log('Form submission started');
    console.log('Form valid:', this.addressForm.valid);
    console.log('Form value:', this.addressForm.value);
    console.log('Form errors:', this.getFormErrors());
    
    if (this.addressForm.invalid) {
      console.log('Form is invalid, marking all fields as touched');
      this.addressForm.markAllAsTouched();
      return;
    }

    if (this.isSubmitting) {
      console.log('Already submitting, ignoring duplicate request');
      return;
    }

    this.isSubmitting = true;

    const addressData = {
      ...this.addressForm.value,
      lat: this.userLat?.toString() || '0',
      long: this.userLng?.toString() || '0' // Note: API expects 'long', not 'lng'
    };
    
    console.log('Sending address data:', addressData);

    this.addressesService.addAddress(addressData).subscribe({
      next: (response) => {
        console.log('Address added successfully:', response);
        this.isSubmitting = false;
        this.backToList();
        
        // Show success message
        alert('Address added successfully!');
      },
      error: (error) => {
        console.error('Error adding address:', error);
        this.isSubmitting = false;
        
        // Show error message
        alert('Error adding address. Please try again.');
      }
    });
  }

removeAddress(addressId: string): void {
    this.addressesService.removeAddress(addressId).subscribe({
      next: (res) => {
        console.log('Address removed successfully:', res);
        this.loadUserAddresses();

      },
      error: (error) => {
        alert('Error removing address. Please try again.');
      }
    });
  }

  updateAddress(addressId: string): void {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }

    const addressData = {
      ...this.addressForm.value,
      lat: this.userLat?.toString() || '0',
      long: this.userLng?.toString() || '0'
    };

    this.addressesService.updateAddress(addressId, addressData).subscribe({
      next: (res) => {
        console.log('Address updated successfully:', res);
        this.backToList();
 
      },
      error: (error) => {
        console.error('Error updating address:', error);
     
      }
    });
  }

  ngOnInit(): void {
    this.loadUserAddresses();
  }
  ngAfterViewInit(): void {
    this.loadUserAddresses();
    

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.userLat = position.coords.latitude;
          this.userLng = position.coords.longitude;
        },
        (error) => {
          console.error('Error getting location:', error);
          this.userLat = 30.033333;
          this.userLng = 31.233334;
        }
      );
    }
  }

  ngOnDestroy(): void {
    this.destroyMap();
  }
  private getFormErrors(): any {
    let errors: any = {};
    Object.keys(this.addressForm.controls).forEach(key => {
      const controlError = this.addressForm.get(key)?.errors;
      if (controlError) {
        errors[key] = controlError;
      }
    });
    return errors;
  }
}
