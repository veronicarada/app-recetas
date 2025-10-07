import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

type Receta = {
  id: number;
  titulo: string;
  imagen: string;
  tiempoMin?: number;
  favorito?: boolean;
};

type Ingrediente = {
  id: number;
  nombre: string;
  stock?: string; // opcional: ej. '2u', '500g'
};

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class HomePage {
  usuario = 'Juan';

  // Mock de recetas sugeridas (simulan lo que un día vendrá de Supabase)
  recetas: Receta[] = [
    {
      id: 1,
      titulo: 'Adelada de',
      imagen: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1200&auto=format&fit=crop',
    },
    {
      id: 2,
      titulo: 'Enchiladas x2',
      imagen: 'https://images.unsplash.com/photo-1604908176997-4316c682c915?q=80&w=1200&auto=format&fit=crop',
      tiempoMin: 15,
      favorito: true,
    },
    {
      id: 3,
      titulo: 'Ensalada fruti',
      imagen: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1200&auto=format&fit=crop',
    },
  ];

  ingredientes: Ingrediente[] = [
    { id: 1, nombre: 'cebolla' },
    { id: 2, nombre: 'harina' },
    { id: 3, nombre: 'huevo' },
  ];

  // Gastos semanales mock
  presupuestoSemana = 1200;     // lo que “tenés”
  gastadoSemana = 374;          // lo que ya gastaste (mock)
  get restanteSemana() {
    return Math.max(this.presupuestoSemana - this.gastadoSemana, 0);
  }
  /** Porcentaje gastado 0..1 para el anillo */
  get pctGastado() {
    return Math.min(this.gastadoSemana / this.presupuestoSemana, 1);
  }

  // Acciones rápidas (hoy sólo navegan a tabs/.. si ya existen)
  go(section: 'home'|'health'|'capture'|'stats'|'profile'|'plus'|'recetas'|'ingredientes'|'gastos') {
    // de momento sin router: este stub te deja colgar (click) en el HTML.
    // Cuando quieras, inyectamos Router y hacemos navigateByUrl('/tabs/...').
    console.log('Ir a:', section);
  }

  toggleFav(receta: Receta) {
    receta.favorito = !receta.favorito;
  }
}
