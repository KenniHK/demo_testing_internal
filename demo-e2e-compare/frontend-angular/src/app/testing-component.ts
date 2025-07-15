import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-testing',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  template: `
    <h2 class="text-xl font-semibold mb-4">E2E Test Demo</h2>

    <div class="flex gap-4 mb-6">

    <button (click)="runLoginTest('selenium')" class="bg-blue-500 text-white px-4 py-2 rounded">Login Test (Selenium)</button>
    <button (click)="runLoginTest('playwright')" class="bg-green-500 text-white px-4 py-2 rounded">Login Test (Playwright)</button>

    </div>

    <div *ngIf="result()" class="border p-4 rounded shadow bg-white">
      <h3 class="font-bold mb-2">Hasil Test: {{ result()?.tool }}</h3>
      <p><strong>Durasi:</strong> {{ result()?.duration }} detik</p>
      <p><strong>Log:</strong></p>
      <pre class="bg-gray-100 p-2 text-sm overflow-x-auto">{{ result()?.log }}</pre>

      <div class="mt-4">
        <strong>Screenshot:</strong><br />
        <img [src]="screenshotUrl()" alt="Screenshot" class="max-w-full border mt-2" />
      </div>
    </div>
  `
})
export class TestingComponent {
  result = signal<any | null>(null);

  constructor(private http: HttpClient) {}

  runTest(tool: 'selenium' | 'playwright') {
    this.result.set(null); // Reset sebelum test
    this.http.get<any>(`http://localhost:3000/run-test?tool=${tool}`).subscribe({
      next: (res) => this.result.set(res),
      error: (err) => this.result.set({ tool, log: '❌ Gagal menjalankan test', error: err.message, duration: 0 })
    });
  }

  screenshotUrl(): string {
    const res = this.result();
    return res?.screenshot ? `http://localhost:3000${res.screenshot}?t=${Date.now()}` : '';
  }

  runLoginTest(tool: 'selenium' | 'playwright') {
  this.result.set(null);
  this.http.get<any>(`http://localhost:3000/run-test-login?tool=${tool}`).subscribe({
    next: (res) => this.result.set(res),
    error: (err) => this.result.set({ tool, log: '❌ Gagal login test', error: err.message, duration: 0 })
  });
}

}
