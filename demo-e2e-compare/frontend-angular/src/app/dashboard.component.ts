import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgFor } from '@angular/common';

@Component({
  standalone: true,
  imports: [NgFor, HttpClientModule],
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  tokoList: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    this.http.get<any>('http://localhost:3000/api/toko', {
      headers: { Authorization: 'Bearer ' + token }
    }).subscribe(res => this.tokoList = res.data);
  }
}
