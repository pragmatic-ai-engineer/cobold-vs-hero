import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface BriefingResponse {
  signal: string;
  headline: string;
  requiredEvidence: string[];
  missingEvidence: string[];
  stopCondition: string;
  nextAction: string;
  reviewMatrix: ReviewMatrixRow[];
}

interface ReviewMatrixRow {
  surface: string;
  expectedEvidence: string[];
  providedEvidence: string[];
  gap: string;
  nextAction: string;
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

  changeTitle = 'Status panel mapping';
  changeDescription = 'Add one backend field, one BFF mapper, and one Angular status panel.';
  affectedSurfaces = ['backend', 'bff', 'frontend'];
  providedEvidence = ['backend-test', 'hld', 'lld'];
  riskFlags: string[] = [];

  readonly surfaceOptions = [
    { value: 'backend', label: 'Backend' },
    { value: 'bff', label: 'BFF' },
    { value: 'frontend', label: 'Frontend' },
    { value: 'contract', label: 'Contract' },
    { value: 'testing', label: 'Testing' },
  ];
  readonly evidenceOptions = [
    { value: 'backend-test', label: 'Backend test' },
    { value: 'bruno-smoke', label: 'Bruno smoke' },
    { value: 'dps-testautomation', label: 'DPS-lite automation' },
    { value: 'browser-screenshot', label: 'Browser screenshot' },
    { value: 'hld', label: 'HLD' },
    { value: 'lld', label: 'LLD' },
  ];
  readonly riskOptions = [
    { value: 'production', label: 'Production' },
    { value: 'customer-data', label: 'Customer data' },
    { value: 'auth', label: 'Auth' },
    { value: 'payment', label: 'Payment' },
    { value: 'unclear-scope', label: 'Unclear scope' },
  ];

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
        affectedSurfaces: this.affectedSurfaces,
        changeDescription: this.changeDescription,
        changeTitle: this.changeTitle,
        providedEvidence: this.providedEvidence,
        riskFlags: this.riskFlags,
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

  toggleSelection(values: string[], value: string): void {
    const index = values.indexOf(value);

    if (index >= 0) {
      values.splice(index, 1);
      return;
    }

    values.push(value);
  }

  hasSelection(values: string[], value: string): boolean {
    return values.includes(value);
  }
}
