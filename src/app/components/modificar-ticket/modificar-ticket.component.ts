import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButton, IonInput } from '@ionic/angular/standalone';

@Component({
  selector: 'app-modificar-ticket',
  templateUrl: './modificar-ticket.component.html',
  styleUrls: ['./modificar-ticket.component.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonList, IonItem, IonLabel, IonButton, IonInput],
  providers: [ModalController] // Asegúrate de que ModalController esté disponible como proveedor
})
export class ModificarTicketComponent implements OnInit {

  @Input() tiempoPorTicket: number = 300; // Tiempo por ticket en segundos
  @Input() valorPorTicket: number = 1000; // Valor por ticket
  @Output() guardarCambios = new EventEmitter<{ tiempo: number; valor: number }>();

  constructor(private modalController: ModalController) {}

  // Función para incrementar el valor por ticket en 500
  incrementarValor() {
    this.valorPorTicket += 500;
  }

  // Función para decrementar el valor por ticket en 500
  decrementarValor() {
    if (this.valorPorTicket - 500 >= 0) {
      this.valorPorTicket -= 500;
    }
  }

  // Función para cerrar el modal y emitir los cambios
  guardar() {
    if (this.tiempoPorTicket < 0 || isNaN(this.tiempoPorTicket)) {
      alert('El tiempo por ticket debe ser un número válido mayor o igual a 0.');
      return;
    }

    if (this.valorPorTicket < 0 || isNaN(this.valorPorTicket)) {
      alert('El valor por ticket debe ser un número válido mayor o igual a 0.');
      return;
    }

    this.guardarCambios.emit({
      tiempo: this.tiempoPorTicket,
      valor: this.valorPorTicket,
    });
    this.modalController.dismiss();
  }

  // Función para cerrar el modal sin guardar cambios
  cancelar() {
    this.modalController.dismiss();
  }

  ngOnInit() {}

}