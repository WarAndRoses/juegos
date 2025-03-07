import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButton, IonInput } from '@ionic/angular/standalone';

@Component({
  selector: 'app-agregar-clientes',
  templateUrl: './agregar-clientes.component.html',
  styleUrls: ['./agregar-clientes.component.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonList, IonItem, IonLabel, IonButton, IonInput],
  providers: [ModalController] // Asegúrate de que ModalController esté disponible como proveedor
})
export class AgregarClientesComponent implements OnInit {

  nombre: string = '';
  cantidadTickets: number = 0;

  constructor(private modalController: ModalController) {}

  // Función para cerrar el modal y emitir los datos
  guardar() {
    if (!this.nombre || this.cantidadTickets <= 0 || isNaN(this.cantidadTickets)) {
      alert('Debe ingresar un nombre válido y una cantidad de tickets válida.');
      return;
    }

    this.modalController.dismiss({
      nombre: this.nombre,
      cantidadTickets: this.cantidadTickets,
    });
  }

  // Función para cerrar el modal sin guardar cambios
  cancelar() {
    this.modalController.dismiss();
  }

  ngOnInit() {}

}