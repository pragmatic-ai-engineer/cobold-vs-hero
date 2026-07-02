import tracer from '../tracer';

type LogLevel = 'info' | 'warn' | 'error';

type LogAttributes = Record<string, unknown>;

export function logInfo(message: string, attributes: LogAttributes = {}): void {
  writeLog('info', message, attributes);
}

export function logWarn(message: string, attributes: LogAttributes = {}): void {
  writeLog('warn', message, attributes);
}

function writeLog(level: LogLevel, message: string, attributes: LogAttributes): void {
  const spanContext = tracer.scope().active()?.context();
  const event = removeUndefined({
    timestamp: new Date().toISOString(),
    level,
    message,
    service: process.env.DD_SERVICE ?? 'cobold-vs-hero-bff',
    env: process.env.DD_ENV,
    version: process.env.DD_VERSION,
    'dd.trace_id': spanContext?.toTraceId(),
    'dd.span_id': spanContext?.toSpanId(),
    ...attributes,
  });
  const line = JSON.stringify(event);

  if (level === 'error') {
    console.error(line);
    return;
  }
  if (level === 'warn') {
    console.warn(line);
    return;
  }
  console.log(line);
}

function removeUndefined(attributes: LogAttributes): LogAttributes {
  return Object.fromEntries(Object.entries(attributes).filter(([, value]) => value !== undefined));
}
