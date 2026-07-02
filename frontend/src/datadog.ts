import { datadogLogs } from '@datadog/browser-logs';
import { datadogRum, type RumInitConfiguration } from '@datadog/browser-rum';
import type { PropagatorType } from '@datadog/browser-rum';
import { angularPlugin } from '@datadog/browser-rum-angular';

type DatadogSite = NonNullable<RumInitConfiguration['site']>;
type DefaultPrivacyLevel = NonNullable<RumInitConfiguration['defaultPrivacyLevel']>;
type TraceContextInjection = NonNullable<RumInitConfiguration['traceContextInjection']>;

interface DatadogBrowserConfig {
  allowedTracingUrls?: string[];
  clientToken?: string;
  enabled?: boolean;
  env?: string;
  logs?: {
    enabled?: boolean;
    forwardConsoleLogs?: ('debug' | 'info' | 'warn' | 'error')[];
    forwardErrorsToLogs?: boolean;
    sessionSampleRate?: number;
  };
  rum?: {
    applicationId?: string;
    defaultPrivacyLevel?: DefaultPrivacyLevel;
    enabled?: boolean;
    sessionReplaySampleRate?: number;
    sessionSampleRate?: number;
    traceContextInjection?: TraceContextInjection;
    traceSampleRate?: number;
  };
  service?: string;
  site?: DatadogSite;
  version?: string;
}

declare global {
  interface Window {
    __COBOLD_DATADOG__?: DatadogBrowserConfig;
  }
}

const config = window.__COBOLD_DATADOG__;

if (config?.enabled && config.clientToken && config.site) {
  const service = config.service ?? 'cobold-vs-hero-angular';
  const commonConfig = {
    clientToken: config.clientToken,
    env: config.env,
    service,
    site: config.site,
    version: config.version,
  };

  if (config.logs?.enabled !== false) {
    datadogLogs.init({
      ...commonConfig,
      forwardConsoleLogs: config.logs?.forwardConsoleLogs ?? ['warn', 'error'],
      forwardErrorsToLogs: config.logs?.forwardErrorsToLogs ?? true,
      sessionSampleRate: config.logs?.sessionSampleRate ?? 100,
    });
  }

  if (config.rum?.enabled !== false && config.rum?.applicationId) {
    const propagatorTypes: PropagatorType[] = ['datadog', 'tracecontext'];

    datadogRum.init({
      ...commonConfig,
      allowedTracingUrls: [
        {
          match: (url: string) => isSameOriginApiRequest(url),
          propagatorTypes,
        },
        ...(config.allowedTracingUrls ?? []).map((match) => ({ match, propagatorTypes })),
      ],
      applicationId: config.rum.applicationId,
      defaultPrivacyLevel: config.rum.defaultPrivacyLevel ?? 'mask-user-input',
      plugins: [angularPlugin({ router: true })],
      sessionReplaySampleRate: config.rum.sessionReplaySampleRate ?? 20,
      sessionSampleRate: config.rum.sessionSampleRate ?? 100,
      traceContextInjection: config.rum.traceContextInjection ?? 'all',
      traceSampleRate: config.rum.traceSampleRate ?? 100,
      trackLongTasks: true,
      trackResources: true,
      trackUserInteractions: true,
    });
  }
}

function isSameOriginApiRequest(url: string): boolean {
  const target = new URL(url, window.location.href);

  return target.origin === window.location.origin && target.pathname.startsWith('/api/');
}
