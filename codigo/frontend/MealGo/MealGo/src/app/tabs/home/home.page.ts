// src/app/tabs/home/home.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  // 👇 IMPORTANTE: FormsModule habilita [(ngModel)]
  imports: [CommonModule, IonicModule, FormsModule],
})
export class HomePage implements OnInit {
  productos: any[] = [];

  // modelo para alta
  nuevoProducto = { nombre: '', precio: 0, stock: 0 };

  // edición
  editando = false;
  productoEditando: any = null;

  constructor(private db: DatabaseService) {}

  async ngOnInit() {
    await this.cargarProductos();
  }

  // LISTAR
  async cargarProductos() {
    const data = await this.db.getAll('productos'); // ajusta si tu método se llama distinto
    this.productos = data ?? [];
  }

  // ALTA
  async agregar() {
    await this.db.insert('productos', { ...this.nuevoProducto });
    this.nuevoProducto = { nombre: '', precio: 0, stock: 0 };
    await this.cargarProductos();
  }

  // PREPARAR EDICIÓN
  editar(p: any) {
    this.editando = true;
    this.productoEditando = { ...p }; // copia para no tocar el listado directo
  }

  // GUARDAR EDICIÓN
  async guardarEdicion() {
    await this.db.update('productos', this.productoEditando.id, this.productoEditando);
    this.editando = false;
    this.productoEditando = null;
    await this.cargarProductos();
  }

  // CANCELAR EDICIÓN
  cancelarEdicion() {
    this.editando = false;
    this.productoEditando = null;
  }

  // BORRAR
  async eliminarProducto(id: number) {
    // usa el nombre que tengas en tu servicio: delete o remove
    if (this.db.remove) {
      await this.db.remove('productos', id);
    } else if (this.db.remove) {
      await this.db.remove('productos', id);
    }
    await this.cargarProductos();
  }
}
