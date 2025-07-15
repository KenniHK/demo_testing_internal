import { Component, OnInit } from '@angular/core';
import { NgFor, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TokoService, Toko } from './toko.services';
import { HttpClientModule } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  imports: [NgFor, CommonModule, FormsModule, HttpClientModule],
})
export class DashboardComponent implements OnInit {
  selected: Toko | null = null;
  token: string | null = null;

  constructor(public tokoService: TokoService) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.tokoService.load(this.token);
  }

  newToko() {
    this.selected = { id: 0, name: '', city: '', status: 'Aktif' };
  }

  edit(toko: Toko) {
    this.selected = { ...toko };
  }

  save() {
    if (!this.selected || !this.token) return;
    if (this.selected.id === 0) {
      this.tokoService.add(this.selected, this.token).subscribe(() => {
        this.tokoService.load(this.token);
        this.selected = null;
      });
    } else {
      this.tokoService.update(this.selected, this.token).subscribe(() => {
        this.tokoService.load(this.token);
        this.selected = null;
      });
    }
  }

  cancel() {
    this.selected = null;
  }

  delete(id: number) {
    if (!this.token) return;
    this.tokoService.delete(id, this.token).subscribe(() => {
      this.tokoService.load(this.token);
    });
  }
}
