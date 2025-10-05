// src/app/services/database.service.ts
import { Injectable } from '@angular/core';
import { supabase } from './supabase';

@Injectable({ providedIn: 'root' })
export class DatabaseService {

  // --------- CRUD genéricos ---------
  async getAll(table: string) {
    const { data, error } = await supabase.from(table).select('*');
    if (error) throw error;
    return data;
  }

  async insert(table: string, record: any) {
    const { data, error } = await supabase.from(table).insert([record]).select();
    if (error) throw error;
    return data;
  }

  async update(table: string, id: number | string, record: any) {
    const { data, error } = await supabase.from(table).update(record).eq('id', id).select();
    if (error) throw error;
    return data;
  }

  async remove(table: string, id: number | string) {
    const { data, error } = await supabase.from(table).delete().eq('id', id).select();
    if (error) throw error;
    return data;
  }

  // --------- Ejemplo específico para productos ---------
  async getProductos() { return this.getAll('productos'); }
  async addProducto(prod: any) { return this.insert('productos', prod); }
  async updateProducto(id: number, prod: any) { return this.update('productos', id, prod); }
  async deleteProducto(id: number) { return this.remove('productos', id); }
}