import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonButton,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular/standalone'; // Importar ModalController
import { ModificarTicketComponent } from '../components/modificar-ticket/modificar-ticket.component'; // Importar el componente del modal

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonCard,
    IonButton,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
  ],
})
export class MainPage implements OnInit {
  usuario: string;
  tiempoPorTicket: number = 300; // Tiempo por ticket en segundos (por defecto 5 minutos)
  valorPorTicket: number = 1000; // Valor por ticket (por defecto 1000)

  constructor(private router: Router, private modalController: ModalController) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.usuario = navigation.extras.state['usuario'];
    } else {
      this.usuario = localStorage.getItem('usuario') || '';
    }

    // Recuperar el tiempo y valor por ticket del localStorage
    this.tiempoPorTicket = parseInt(localStorage.getItem('tiempoPorTicket') || '300', 10);
    this.valorPorTicket = parseInt(localStorage.getItem('valorPorTicket') || '1000', 10);
  }

  ngOnInit(): void {
    console.log('Página main cargada');
  }

  // Función para abrir el modal de modificación
  async modificarTiempoYValorPorTicket() {
    const modal = await this.modalController.create({
      component: ModificarTicketComponent,
      componentProps: {
        tiempoPorTicket: this.tiempoPorTicket / 60, // Convertir a minutos
        valorPorTicket: this.valorPorTicket,
      },
    });

    modal.onDidDismiss().then((data) => {
      if (data.data) {
        const { tiempo, valor } = data.data;
        this.tiempoPorTicket = tiempo * 60; // Convertir a segundos
        this.valorPorTicket = valor;
        localStorage.setItem('tiempoPorTicket', this.tiempoPorTicket.toString());
        localStorage.setItem('valorPorTicket', this.valorPorTicket.toString());
        alert('Cambios guardados correctamente.');
      }
    });

    await modal.present();
  }

  // Función para navegar a la página "en-ejecucion"
  irAEjecucion() {
    this.router.navigate(['/en-ejecucion']);
  }

  // Función para navegar a la página "ventas"
  IrAVentas() {
    this.router.navigate(['/ventas']);
  }
}