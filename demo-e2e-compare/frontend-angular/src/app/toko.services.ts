import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { signal } from '@angular/core';

export interface Toko {
  id: number;
  name: string;
  city: string;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class TokoService {
  tokoList = signal<Toko[]>([]);

  constructor(private http: HttpClient) {}

 load(token: string | null) {
    this.http.get<{ data: Toko[] }>('http://localhost:3000/api/toko', {
      headers: { Authorization: 'Bearer ' + token }
    }).subscribe(res => this.tokoList.set(res.data));
  }

  add(toko: Omit<Toko, 'id'>, token: string | null) {
    return this.http.post<Toko>('http://localhost:3000/api/toko', toko, {
      headers: { Authorization: 'Bearer ' + token }
    });
  }

  update(toko: Toko, token: string | null) {
    return this.http.put<Toko>(`http://localhost:3000/api/toko/${toko.id}`, toko, {
      headers: { Authorization: 'Bearer ' + token }
    });
  }

  delete(id: number, token: string | null) {
    return this.http.delete(`http://localhost:3000/api/toko/${id}`, {
      headers: { Authorization: 'Bearer ' + token }
    });
  }
}