import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController, ToastController, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatabaseService } from '../../services/database.service';
import { supabase } from '../../supabase';
import { RecipeTagsModal } from './recipe-tags.modal';

type Receta = {
  id_receta?: number;
  id_usuario: string;
  nombre: string;
  instrucciones: string;
  tiempo_preparacion: number;
  dificultad: 'facil'|'media'|'dificil';
  fecha_creacion?: string;
};

@Component({
  standalone: true,
  selector: 'app-recipes',
  templateUrl: './recipes.page.html',
  styleUrls: ['./recipes.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule]
})
export class RecipesPage implements OnInit {
  table = 'receta';
  userId = '';
  loading = false;

  recetas: Receta[] = [];

  // formulario
  form: Receta = {
    id_usuario: '',
    nombre: '',
    instrucciones: '',
    tiempo_preparacion: 0,
    dificultad: 'media'
  };
  editingId: number | null = null;

  constructor(
    private db: DatabaseService,
    private modal: ModalController,
    private toast: ToastController,
    private alert: AlertController
  ) {}

  async ngOnInit() {
    const { data } = await supabase.auth.getUser();
    this.userId = data?.user?.id ?? '';
    this.form.id_usuario = this.userId;
    await this.load();
  }

  async load() {
    if (!this.userId) return;
    this.loading = true;
    this.recetas = await this.db.getWhere<Receta>(this.table, { column: 'id_usuario', value: this.userId });
    this.loading = false;
  }

  selectForEdit(r: Receta) {
    this.editingId = r.id_receta!;
    this.form = { ...r };
  }

  reset() {
    this.editingId = null;
    this.form = { id_usuario: this.userId, nombre: '', instrucciones: '', tiempo_preparacion: 0, dificultad: 'media' };
  }

  async save() {
    try {
      if (!this.form.nombre.trim()) {
        (await this.toast.create({ message: 'Poné un nombre a la receta', duration: 1500 })).present();
        return;
      }
      if (this.editingId) {
        await this.db.update(this.table, this.editingId, {
          nombre: this.form.nombre,
          instrucciones: this.form.instrucciones,
          tiempo_preparacion: this.form.tiempo_preparacion,
          dificultad: this.form.dificultad
        });
      } else {
        await this.db.insert(this.table, this.form);
      }
      this.reset();
      await this.load();
    } catch (e: any) {
      (await this.toast.create({ message: e.message ?? 'Error', duration: 1600 })).present();
    }
  }

  async confirmDelete(r: Receta) {
    const al = await this.alert.create({
      header: 'Eliminar',
      message: `¿Borrar "${r.nombre}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Borrar', role: 'destructive', handler: () => this.remove(r) }
      ]
    });
    al.present();
  }

  private async remove(r: Receta) {
    await this.db.delete(this.table, r.id_receta!);
    await this.load();
  }

  async openTags(r: Receta) {
    const m = await this.modal.create({
      component: RecipeTagsModal,
      componentProps: { recetaId: r.id_receta }
    });
    await m.present();
  }
}
