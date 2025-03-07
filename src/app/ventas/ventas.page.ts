import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel } from '@ionic/angular/standalone';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.page.html',
  styleUrls: ['./ventas.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonList, IonItem, IonLabel]
})
export class VentasPage implements OnInit {
  ventas: any;

  constructor() { }

  ngOnInit() {
    this.cargarVentas();
  }
  cargarVentas() {
    const ventasGuardadas = localStorage.getItem('ventas');
    if (ventasGuardadas) {
      this.ventas = JSON.parse(ventasGuardadas); // Convertir el JSON a un array
    }
  }
}
