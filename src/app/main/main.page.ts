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
  IonImg,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular/standalone';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { ModificarTicketComponent } from '../components/modificar-ticket/modificar-ticket.component';

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
    IonImg,
  ],
  providers: [ModalController] // Asegúrate de que ModalController esté disponible como proveedor
})
export class MainPage implements OnInit {
  usuario: string;
  imagenJuego1: string | null = null; // Ruta de la imagen del Juego 1
  imagenJuego2: string | null = null; // Ruta de la imagen del Juego 2
  tiempoPorTicketJuego1: number = 300; // Tiempo por ticket en segundos para Juego 1
  valorPorTicketJuego1: number = 1000; // Valor por ticket para Juego 1
  tiempoPorTicketJuego2: number = 300; // Tiempo por ticket en segundos para Juego 2
  valorPorTicketJuego2: number = 1000; // Valor por ticket para Juego 2

  constructor(private router: Router, private modalController: ModalController) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.usuario = navigation.extras.state['usuario'];
    } else {
      this.usuario = localStorage.getItem('usuario') || '';
    }

    // Recuperar las rutas de las imágenes desde el localStorage
    this.imagenJuego1 = localStorage.getItem('imagenJuego1');
    this.imagenJuego2 = localStorage.getItem('imagenJuego2');

    // Recuperar el tiempo y valor por ticket desde el localStorage
    this.tiempoPorTicketJuego1 = parseInt(localStorage.getItem('tiempoPorTicketJuego1') || '300', 10);
    this.valorPorTicketJuego1 = parseInt(localStorage.getItem('valorPorTicketJuego1') || '1000', 10);
    this.tiempoPorTicketJuego2 = parseInt(localStorage.getItem('tiempoPorTicketJuego2') || '300', 10);
    this.valorPorTicketJuego2 = parseInt(localStorage.getItem('valorPorTicketJuego2') || '1000', 10);
  }

  ngOnInit(): void {
    console.log('Página main cargada');
  }

  // Función para abrir el modal de modificación
  async modificarTiempoYValorPorTicket() {
    const modal = await this.modalController.create({
      component: ModificarTicketComponent,
      componentProps: {
        tiempoPorTicket: this.tiempoPorTicketJuego1 / 60, // Convertir a minutos
        valorPorTicket: this.valorPorTicketJuego1,
        imagen: this.imagenJuego1, // Pasar la imagen actual del Juego 1 (o Juego 2)
      },
    });

    modal.onDidDismiss().then(async (data) => {
      if (data.data) {
        const { juego, tiempo, valor, imagen } = data.data;

        // Actualizar el tiempo y el valor por ticket
        if (juego === 'juego1') {
          this.tiempoPorTicketJuego1 = tiempo * 60; // Convertir a segundos
          this.valorPorTicketJuego1 = valor;
          localStorage.setItem('tiempoPorTicketJuego1', this.tiempoPorTicketJuego1.toString());
          localStorage.setItem('valorPorTicketJuego1', this.valorPorTicketJuego1.toString());

          // Guardar la nueva imagen si se seleccionó una
          if (imagen) {
            const nombreArchivo = `juego1_${new Date().getTime()}.jpg`;
            const archivoGuardado = await Filesystem.writeFile({
              path: nombreArchivo,
              data: await this.convertirUriABase64(imagen),
              directory: Directory.Data,
            });

            this.imagenJuego1 = archivoGuardado.uri;
            localStorage.setItem('imagenJuego1', archivoGuardado.uri);
          }
        } else if (juego === 'juego2') {
          this.tiempoPorTicketJuego2 = tiempo * 60; // Convertir a segundos
          this.valorPorTicketJuego2 = valor;
          localStorage.setItem('tiempoPorTicketJuego2', this.tiempoPorTicketJuego2.toString());
          localStorage.setItem('valorPorTicketJuego2', this.valorPorTicketJuego2.toString());

          // Guardar la nueva imagen si se seleccionó una
          if (imagen) {
            const nombreArchivo = `juego2_${new Date().getTime()}.jpg`;
            const archivoGuardado = await Filesystem.writeFile({
              path: nombreArchivo,
              data: await this.convertirUriABase64(imagen),
              directory: Directory.Data,
            });

            this.imagenJuego2 = archivoGuardado.uri;
            localStorage.setItem('imagenJuego2', archivoGuardado.uri);
          }
        }

        alert('Cambios guardados correctamente.');
      }
    });

    await modal.present();
  }

  // Función para convertir una URI en base64
  private async convertirUriABase64(uri: string): Promise<string> {
    const respuesta = await fetch(uri);
    const blob = await respuesta.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
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