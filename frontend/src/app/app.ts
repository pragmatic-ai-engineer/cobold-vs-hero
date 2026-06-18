import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface BriefingResponse {
  signal: string;
  headline: string;
  reviewerNote: string;
  reason: string;
  nextAction: string;
  evidencePrompts: string[];
  checklist: string[];
}

interface ServiceStatus {
  service: string;
  runtime: string;
  status: 'UP' | 'DOWN';
  checkedAt: string;
  endpoint: string;
  detail?: string;
}

interface SystemStatusResponse {
  status: 'UP' | 'DEGRADED';
  checkedAt: string;
  services: ServiceStatus[];
}

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly bffBaseUrl = new URLSearchParams(window.location.search).get('bffBaseUrl') ?? 'http://localhost:3000';

  coboldConcern = 'The billing retry job owns customer invoices and runs during release night.';
  heroMove = 'Add one small Java endpoint and one Angular panel with targeted tests.';
  systemMood = 'curious but tired';

  readonly briefing = signal<BriefingResponse | null>(null);
  readonly loading = signal(false);
  readonly error = signal('');
  readonly systemStatus = signal<SystemStatusResponse | null>(null);
  readonly statusLoading = signal(false);
  readonly statusError = signal('');

  ngOnInit(): void {
    this.refreshStatus();
  }

  refreshStatus(): void {
    this.statusLoading.set(true);
    this.statusError.set('');

    this.http
      .get<SystemStatusResponse>(`${this.bffBaseUrl}/api/cobold-vs-hero/status`)
      .subscribe({
        next: (systemStatus) => {
          this.systemStatus.set(systemStatus);
          this.statusLoading.set(false);
        },
        error: () => {
          this.statusError.set('The BFF status endpoint is not reachable on port 3000.');
          this.statusLoading.set(false);
        },
      });
  }

  requestBriefing(): void {
    this.loading.set(true);
    this.error.set('');

    this.http
      .post<BriefingResponse>(`${this.bffBaseUrl}/api/cobold-vs-hero/briefing`, {
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
          this.error.set('The briefing flow is not reachable. Start the BFF on port 3000 and backend on port 8080.');
          this.loading.set(false);
        },
      });
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

  serviceLabel(service: ServiceStatus): string {
    return service.service === 'be-java' ? 'BE Java' : 'BFF NestJS';
  }
}
