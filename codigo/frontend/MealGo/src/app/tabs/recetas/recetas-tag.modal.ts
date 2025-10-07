import { Component, OnInit, Input } from '@angular/core';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatabaseService } from '../../services/database.service';

type Etiqueta = { id_etiqueta: number; nombre: string; tipo: string; descripcion?: string };

@Component({
  standalone: true,
  selector: 'app-recipe-tags-modal',
  templateUrl: './recipe-tags.modal.html',
  styleUrls: ['./recipe-tags.modal.scss'],
  imports: [IonicModule, CommonModule, FormsModule]
})
export class RecipeTagsModal implements OnInit {
  @Input() recetaId!: number;

  etiquetas: Etiqueta[] = [];
  selected = new Set<number>();

  constructor(private db: DatabaseService, private modal: ModalController, private toast: ToastController) {}

  async ngOnInit() {
    // todas las etiquetas
    this.etiquetas = await this.db.getAll('etiquetas') as any;

    // etiquetas ya asociadas a la receta
    const links = await this.db.getWhere<any>('receta_etiqueta', { column: 'id_receta', value: this.recetaId });
    this.selected = new Set(links.map((l: any) => l.id_etiqueta));
  }

  toggle(id: number, checked: boolean) {
    if (checked) this.selected.add(id);
    else this.selected.delete(id);
  }

  async save() {
    try {
      // borrar todas y reinsertar (rápido y seguro)
      const prev = await this.db.getWhere<any>('receta_etiqueta', { column: 'id_receta', value: this.recetaId });
      await Promise.all(prev.map((p: any) => this.db.delete('receta_etiqueta', p.id))); // si tu puente no tiene id autoinc, cambiá a delete con match compuesto

      const toInsert = Array.from(this.selected).map(id_etiqueta => ({ id_receta: this.recetaId, id_etiqueta }));
      for (const row of toInsert) { await this.db.insert('receta_etiqueta', row); }

      (await this.toast.create({ message: 'Etiquetas actualizadas', duration: 1200 })).present();
      this.modal.dismiss(true);
    } catch (e: any) {
      (await this.toast.create({ message: e.message ?? 'Error', duration: 1600 })).present();
    }
  }

  close(){ this.modal.dismiss(); }
}
