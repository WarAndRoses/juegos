import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertController, Platform, ModalController } from '@ionic/angular';
import { App } from '@capacitor/app';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { AgregarClientesComponent } from '../components/agregar-clientes/agregar-clientes.component';
@Component({
  selector: 'app-en-ejecucion',
  templateUrl: './en-ejecucion.page.html',
  styleUrls: ['./en-ejecucion.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonButtons,
    IonButton,
    IonIcon,
    IonList,
    IonItem,
    IonLabel,
  ],
  providers: [ModalController] // Asegúrate de que ModalController esté disponible como proveedor
})
export class EnEjecucionPage implements OnInit, OnDestroy {
  filas: any[] = []; // Array para almacenar las filas de niños
  tiempoPorTicket: number = 300; // Tiempo por ticket en segundos (por defecto 5 minutos)
  valorPorTicket: number = 1000; // Valor por ticket (por defecto 1000)
  backButtonSubscription: any; // Variable para almacenar la suscripción del botón de retroceso
  ventas: any[] = []; // Array para almacenar las ventas

  constructor(private alertController: AlertController, private platform: Platform, private modalController: ModalController) {
    addIcons({ add }); // Registra el icono "add"
    this.tiempoPorTicket = parseInt(localStorage.getItem('tiempoPorTicket') || '300', 10); // Recupera el tiempo por ticket
    this.valorPorTicket = parseInt(localStorage.getItem('valorPorTicket') || '1000', 10); // Recupera el valor por ticket
  }

  ngOnInit(): void {
    console.log('Página en-ejecucion cargada');
    this.recuperarEstadoTemporizador(); // Recuperar el estado del temporizador al cargar la página
    this.cargarVentas(); // Cargar las ventas desde el localStorage

    // Capturar el evento de retroceso del dispositivo
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(10, async () => {
      const alert = await this.alertController.create({
        header: 'Confirmación',
        message: '¿Seguro que quieres salir?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
          },
          {
            text: 'Salir',
            handler: () => {
              App.exitApp(); // Esto cierra la aplicación
            },
          },
        ],
      });

      await alert.present();
    });
  }

  ngOnDestroy(): void {
    this.guardarEstadoTemporizador(); // Guardar el estado del temporizador antes de destruir el componente
    this.backButtonSubscription.unsubscribe(); // Desuscribirse del evento de retroceso
  }

  // Función para agregar una nueva fila con el nombre del niño y la cantidad de tickets
  async agregarFila() {
    const modal = await this.modalController.create({
      component: AgregarClientesComponent,
    });

    modal.onDidDismiss().then((data) => {
      if (data.data) {
        const { nombre, cantidadTickets } = data.data;

        const tiempoTotal = cantidadTickets * this.tiempoPorTicket; // Calcula el tiempo total
        const valorTotal = cantidadTickets * this.valorPorTicket; // Calcula el valor total

        // Agregar la venta al array de ventas
        const venta = {
          nombre: nombre,
          cantidadTickets: cantidadTickets,
          valorTotal: valorTotal,
          fecha: new Date().toISOString(), // Fecha y hora de la venta
        };
        this.ventas.push(venta);

        // Guardar las ventas en el localStorage
        this.guardarVentas();

        this.filas.push({
          nombre: nombre, // Nombre del niño
          tiempo: tiempoTotal, // Temporizador en segundos
          valor: valorTotal, // Valor total de los tickets
          corriendo: false, // Estado del temporizador
          intervalo: null, // Referencia al intervalo del temporizador
        });
      }
    });

    await modal.present();
  }

  // Función para guardar las ventas en el localStorage
  guardarVentas() {
    localStorage.setItem('ventas', JSON.stringify(this.ventas));
    console.log('Ventas guardadas en localStorage.');
  }

  // Función para cargar las ventas desde el localStorage
  cargarVentas() {
    const ventasGuardadas = localStorage.getItem('ventas');
    if (ventasGuardadas) {
      this.ventas = JSON.parse(ventasGuardadas);
      console.log('Ventas cargadas desde localStorage.');
    }
  }

  // Función para formatear el tiempo en formato MM:SS
  formatearTiempo(segundos: number): string {
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;
    return `${minutos}:${segundosRestantes < 10 ? '0' : ''}${segundosRestantes}`;
  }

  // Función para iniciar o pausar el temporizador
  toggleTemporizador(fila: any) {
    if (fila.corriendo) {
      // Si el temporizador está corriendo, lo pausa
      clearInterval(fila.intervalo);
    } else {
      // Si el temporizador está pausado, lo inicia
      fila.intervalo = setInterval(() => {
        if (fila.tiempo > 0) {
          fila.tiempo--; // Reduce el tiempo en 1 segundo
        } else {
          clearInterval(fila.intervalo); // Detiene el temporizador cuando llega a 0
        }
      }, 1000);
    }
    fila.corriendo = !fila.corriendo; // Cambia el estado del temporizador
  }

  // Función para guardar el estado del temporizador en localStorage
  guardarEstadoTemporizador() {
    const estado = this.filas.map(fila => ({
      nombre: fila.nombre,
      tiempo: fila.tiempo,
      valor: fila.valor,
      corriendo: fila.corriendo,
    }));
    localStorage.setItem('temporizador', JSON.stringify(estado));
  }

  // Función para recuperar el estado del temporizador desde localStorage
  recuperarEstadoTemporizador() {
    const temporizadorGuardado = localStorage.getItem('temporizador');
    if (temporizadorGuardado) {
      const estado = JSON.parse(temporizadorGuardado);
      this.filas = estado.map((fila: any) => ({
        ...fila,
        intervalo: null, // Inicialmente, no hay intervalo activo
      }));
    }
  }
}