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

  coboldConcern = 'The billing retry job owns customer invoices and runs during release night.';
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
          this.error.set('The backend briefing service is not reachable. Start the Spring Boot API on port 8080.');
          this.loading.set(false);
        },
      });
  }

  reasonFor(signal: string): string {
    switch (signal) {
      case 'shield-wall':
        return 'High-risk path: production-sensitive work needs a smaller slice before implementation.';
      case 'sparring':
        return 'Medium-risk path: the idea is useful, but the team needs sharper acceptance criteria.';
      default:
        return 'Low-risk path: the move is small, targeted, and has verification evidence before the MR.';
    }
  }

  statusFor(signal: string): string {
    switch (signal) {
      case 'shield-wall':
        return 'Split before review';
      case 'sparring':
        return 'Sharpen before MR';
      default:
        return 'Review-ready slice';
    }
  }
}
