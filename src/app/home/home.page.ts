import { Component, OnInit } from '@angular/core'; // Importa OnInit
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton } from '@ionic/angular/standalone';
import { ToastController } from '@ionic/angular/standalone'; // Importa ToastController

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton],
})
export class HomePage implements OnInit { // Implementa OnInit
  constructor(private router: Router, private toastController: ToastController) {} // Inyecta ToastController

  // Verifica si ya hay un nombre de usuario guardado al iniciar la página
  ngOnInit() {
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
      // Si existe, redirige a la página "main"
      this.router.navigate(['/main'], {
        state: { usuario },
      });
    }
  }

  // Función para navegar a la página "main" si el usuario ha ingresado un nombre
  IrMain(usuarioInput: IonInput) {
    const valorUsuario = usuarioInput.value;

    if (!valorUsuario || valorUsuario.toString().trim() === '') {
      this.mostrarError('Por favor, ingrese un nombre de usuario.');
      return;
    }

    // Guarda el nombre de usuario en el localStorage
    localStorage.setItem('usuario', valorUsuario.toString());

    // Navega a la página "main" y envía el nombre de usuario como parámetro
    this.router.navigate(['/main'], {
      state: { usuario: valorUsuario }, // Envía el nombre de usuario
    });
  }

  // Función para mostrar un mensaje de error usando Toast
  async mostrarError(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000, // Duración en milisegundos
      position: 'top', // Posición del toast
      color: 'danger', // Color del toast
    });
    toast.present();
  }
}