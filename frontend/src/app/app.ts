import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface BriefingResponse {
  signal: string;
  headline: string;
  coboldWisdom: string;
  heroNextStep: string;
  checklist: string[];
}

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly http = inject(HttpClient);

  coboldConcern = 'The nightly COBOL batch wakes up at 03:00 and eats invoice IDs.';
  heroMove = 'Add one small Java endpoint and one Angular panel with targeted tests.';
  systemMood = 'curious but tired';

  readonly briefing = signal<BriefingResponse | null>(null);
  readonly loading = signal(false);
  readonly error = signal('');

  requestBriefing(): void {
    this.loading.set(true);
    this.error.set('');

    this.http
      .post<BriefingResponse>('http://localhost:8080/api/cobold-vs-hero/briefing', {
        coboldConcern: this.coboldConcern,
        heroMove: this.heroMove,
        systemMood: this.systemMood,
      })
      .subscribe({
        next: (briefing) => {
          this.briefing.set(briefing);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('The cave tunnel to the backend is closed. Start the Spring Boot API on port 8080.');
          this.loading.set(false);
        },
      });
  }
}
