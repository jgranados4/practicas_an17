import {
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { ContenidoServicesService } from '../../core/services/contenido-services.service';
import { delay } from 'rxjs';
import { Usuario } from '@core/models/usuario';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MensajesComponent } from '../mensajes/mensajes.component';
import { MessageService } from '@core/services/message.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRepeat } from '@fortawesome/free-solid-svg-icons';
import { TablaGridComponent } from '@shared/components/tabla-grid/tabla-grid.component';

@Component({
  selector: 'app-tablas',
  standalone: true,
  imports: [
    FormsModule,
    NavbarComponent,
    MensajesComponent,
    TablaGridComponent,
    CommonModule,
    FontAwesomeModule,
  ],
  templateUrl: './tablas.component.html',
  styleUrl: './tablas.component.css',
})
export class TablasComponent implements OnInit {
  //*Injections
  router = inject(Router);
  //*Variables
  tablas: string = '';
  faRepeat = faRepeat;
  clickAni: boolean = false;
  dataS = signal<any>({ nombre: '', apellido: '', estado: '' });
  datosS = signal<any>(null);
  isEditing: string = '';
  messageBoolean: boolean = false;

  constructor(
    private contenido: ContenidoServicesService,
    private msj: MessageService
  ) {
    effect(() => {
      // console.log(`inicio ${JSON.stringify(this.datosS())}`);
    });
  }
  ngOnInit(): void {
    this.contenido.GetContenido(1).subscribe({
      next: (data: any) => {
        const filterData = data.filter(
          (item: Usuario<any>) => item.estado !== 'I'
        );
        this.datosS.set(filterData);
        this.isEditing = 'crear';
        setTimeout(() => {
          this.messageBoolean = false;
        }, 1000);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  //
  clickAnimation() {
    this.clickAni = true;
    setTimeout(() => {
      this.clickAni = false;
    }, 1000);
  }
  // MouseEnter(): void {
  //   this.isSelected = true;
  // }
  // MouseLeave(): void {
  //   this.isSelected = false;
  // }
  //Crear
  crear() {
    this.contenido
      .PostContenido(this.dataS())
      .pipe(delay(1000))
      .subscribe({
        next: (datos: any) => {
          const message = 'creado con exito';
          this.msj.sendMessage(message);
          this.messageBoolean = true;
        },
        error: (error) => {
          console.log(error);
        },
      });
    //limpiar input
    this.dataS();
  }
  //contenido
  capturarContenido(data: any) {
    this.isEditing = 'editar';
  }
  //editar el contenido
  Editar(id: number, data: any) {
    this.contenido
      .PutContenido(id, data)
      .pipe(delay(1000))
      .subscribe({
        next: (data: any) => {
          const message = 'editado con exito';
          this.msj.sendMessage(message);
          this.messageBoolean = true;
          this.ngOnInit();
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
  //eliminar
  Eliminar(id: number): void {
    this.contenido
      .DeleteContenido(id)
      .pipe(delay(1000))
      .subscribe({
        next: (data: any) => {
          console.log(data);
          const message = 'eliminado con exito';
          this.msj.sendMessage(message);
          this.messageBoolean = true;
          this.ngOnInit();
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
  //eliminar todo
  All(): void {
    this.contenido
      .AllContenido()
      .pipe(delay(1000))
      .subscribe({
        next: (data: any) => {
          console.log(data);
          const message = 'Contenido eliminado con exito';
          this.msj.sendMessage(message);
          this.messageBoolean = true;
          this.ngOnInit();
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
  //cancelar, volver a la pagina principal,limpiar
  Cancelar() {
    this.router.navigate(['/Home']);
  }
  //
  RecargarPagina() {
    this.clickAni = true;
    console.log('Recargar');
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['Tablas']);
    });
  }
  //* Scroll
  ScrollAll(tablaId: string): void {
    this.tablas = tablaId;
  }
}
