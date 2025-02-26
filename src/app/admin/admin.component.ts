import { Component } from '@angular/core';
import { SitiosService } from '../services/sitios.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { NavbarComponent } from "../components/navbar/navbar.component";

@Component({
  selector: 'app-admin',
  standalone: true,
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  imports: [MatCardModule, MatButtonModule, CommonModule, FormsModule, NavbarComponent]
})
export class AdminComponent {
  newSite = this.getEmptySite();
  sitios: any[] = [];
  editMode = false;
  selectedSiteId: string | null = null;

  constructor(private sitiosService: SitiosService, private snackBar: MatSnackBar) {
    this.loadSitios();
  }

  // Mira si el sitio existe y si no registra uno nuevo, si no lo edita.
  saveSite(): void {
    if (this.isValidSite(this.newSite)) {
      this.editMode ? this.updateSite() : this.addNewSite();
    } else {
      this.snackBar.open('Por favor, completa todos los campos.', 'Cerrar', { duration: 3000 });
    }
  }

  // Añade un sitio nuevo
  addNewSite(): void {
    const newSiteWithId = { ...this.newSite, id: uuidv4() };
    this.sitiosService.addNewSite(newSiteWithId).subscribe(
      () => {
        this.snackBar.open('Sitio añadido con éxito', 'Cerrar', { duration: 3000 });
        this.loadSitios();
        this.resetForm();
      },
      () => this.snackBar.open('Error al añadir el sitio', 'Cerrar', { duration: 3000 })
    );
  }

  // Editar un sitio
  editSite(site: any): void {
    this.newSite = { ...site };
    this.editMode = true;
    this.selectedSiteId = site.id;
  }

  // Actualizar sitio
  updateSite(): void {
    if (!this.selectedSiteId) return;
    this.sitiosService.updateSite(this.selectedSiteId, this.newSite).subscribe(
      () => {
        this.snackBar.open('Sitio actualizado con éxito', 'Cerrar', { duration: 3000 });
        this.loadSitios();
        this.resetForm();
      },
      () => this.snackBar.open('Error al actualizar el sitio', 'Cerrar', { duration: 3000 })
    );
  }

  // Eliminar sitio
  deleteSite(siteId: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este sitio?')) {
      this.sitiosService.deleteSite(siteId).subscribe(
        () => {
          this.snackBar.open('Sitio eliminado con éxito', 'Cerrar', { duration: 3000 });
          this.loadSitios();
        },
        () => this.snackBar.open('Error al eliminar el sitio', 'Cerrar', { duration: 3000 })
      );
    }
  }

  // Cargar sitios
  loadSitios(): void {
    this.sitiosService.getSitios().subscribe(sitios => this.sitios = sitios);
  }

  // Resetear formulario
  resetForm(): void {
    this.newSite = this.getEmptySite();
    this.editMode = false;
    this.selectedSiteId = null;
  }

  // Validar si un sitio tiene todos los campos completos
  private isValidSite(site: any): boolean {
    return site.name && site.description && site.location && site.imageUrl && site.parrafo1 && site.parrafo2;
  }

  // Devuelve un sitio vacío
  private getEmptySite() {
    return { id: '', name: '', description: '', location: '', imageUrl: '', parrafo1: '', parrafo2: '', imageGallery: [], rating: [], comments: [], commentUser: [] };
  }
}
