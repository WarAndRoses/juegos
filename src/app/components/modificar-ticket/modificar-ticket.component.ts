import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonImg,
} from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular/standalone';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-modificar-ticket',
  templateUrl: './modificar-ticket.component.html',
  styleUrls: ['./modificar-ticket.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonImg,
  ],
})
export class ModificarTicketComponent {
  @Input() tiempoPorTicket: number = 5; // Tiempo por ticket en minutos
  @Input() valorPorTicket: number = 1000; // Valor por ticket
  @Input() imagen: string | null = null; // Imagen actual del juego
  @Output() guardarCambios = new EventEmitter<{ tiempo: number; valor: number; imagen: string | null }>();

  imagenSeleccionada: string | null = null; // Imagen seleccionada en el modal

  constructor(private modalController: ModalController) {}

  // Función para seleccionar una imagen
  async seleccionarImagen() {
    try {
      const imagen = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos, // Usar la galería de fotos
      });

      if (imagen.webPath) {
        this.imagenSeleccionada = imagen.webPath;
      }
    } catch (error) {
      console.error('Error al seleccionar la imagen:', error);
    }
  }

  // Función para validar y ajustar el valor
  ajustarValor(valor: number): number {
    // Asegurar que el valor sea un número
    if (isNaN(valor)) {
      return 0;
    }

    // Asegurar que el valor no sea menor a 0
    if (valor < 0) {
      return 0;
    }

    // Ajustar el valor a intervalos de 500
    return Math.round(valor / 500) * 500;
  }

  // Función para guardar los cambios y cerrar el modal
  guardar() {
    // Validar y ajustar los valores
    this.tiempoPorTicket = this.ajustarValor(this.tiempoPorTicket);
    this.valorPorTicket = this.ajustarValor(this.valorPorTicket);

    // Emitir los cambios
    this.guardarCambios.emit({
      tiempo: this.tiempoPorTicket,
      valor: this.valorPorTicket,
      imagen: this.imagenSeleccionada,
    });

    // Cerrar el modal
    this.modalController.dismiss();
  }

  // Función para cerrar el modal sin guardar cambios
  cancelar() {
    this.modalController.dismiss();
  }
}