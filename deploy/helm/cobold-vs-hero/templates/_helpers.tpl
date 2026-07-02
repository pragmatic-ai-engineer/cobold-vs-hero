{{- define "cobold-vs-hero.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "cobold-vs-hero.fullname" -}}
{{- if .Values.fullnameOverride -}}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- $name := include "cobold-vs-hero.name" . -}}
{{- if contains $name .Release.Name -}}
{{- .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}
{{- end -}}

{{- define "cobold-vs-hero.labels" -}}
helm.sh/chart: {{ .Chart.Name }}-{{ .Chart.Version | replace "+" "_" }}
app.kubernetes.io/name: {{ include "cobold-vs-hero.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end -}}

{{- define "cobold-vs-hero.selectorLabels" -}}
app.kubernetes.io/name: {{ include "cobold-vs-hero.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end -}}

{{- define "cobold-vs-hero.image" -}}
{{- $tag := default .root.Values.global.imageTag .image.tag -}}
{{- printf "%s:%s" .image.repository $tag -}}
{{- end -}}

{{- define "cobold-vs-hero.datadogEnabled" -}}
{{- if and .Values.observability.enabled .Values.observability.datadog.enabled -}}true{{- end -}}
{{- end -}}

{{- define "cobold-vs-hero.datadogBrowserEnabled" -}}
{{- if and (include "cobold-vs-hero.datadogEnabled" .) .Values.observability.datadog.browser.enabled .Values.observability.datadog.browser.clientToken .Values.observability.datadog.browser.rumApplicationId -}}true{{- end -}}
{{- end -}}

{{- define "cobold-vs-hero.datadogVersion" -}}
{{- default .Values.global.imageTag .Values.observability.datadog.version -}}
{{- end -}}

{{- define "cobold-vs-hero.datadogServiceName" -}}
{{- $service := index .root.Values.observability.datadog.services .component -}}
{{- default (printf "%s-%s" .root.Values.observability.datadog.serviceNamespace .component) $service -}}
{{- end -}}

{{- define "cobold-vs-hero.datadogTags" -}}
tags.datadoghq.com/env: {{ .root.Values.observability.datadog.env | quote }}
tags.datadoghq.com/service: {{ include "cobold-vs-hero.datadogServiceName" . | quote }}
tags.datadoghq.com/version: {{ include "cobold-vs-hero.datadogVersion" .root | quote }}
{{- end -}}

{{- define "cobold-vs-hero.datadogLogConfig" -}}
{{- list (dict "source" .source "service" (include "cobold-vs-hero.datadogServiceName" .)) | toJson | quote -}}
{{- end -}}

{{- define "cobold-vs-hero.datadogEnv" -}}
- name: DD_ENV
  value: {{ .root.Values.observability.datadog.env | quote }}
- name: DD_SERVICE
  value: {{ include "cobold-vs-hero.datadogServiceName" . | quote }}
- name: DD_VERSION
  value: {{ include "cobold-vs-hero.datadogVersion" .root | quote }}
- name: DD_AGENT_HOST
  valueFrom:
    fieldRef:
      fieldPath: status.hostIP
- name: DD_TRACE_SAMPLE_RATE
  value: {{ .root.Values.observability.datadog.apm.traceSampleRate | quote }}
- name: DD_TRACE_SAMPLING_RULES
  value: {{ .root.Values.observability.datadog.apm.traceSamplingRules | quote }}
- name: DD_TRACE_RATE_LIMIT
  value: {{ .root.Values.observability.datadog.apm.traceRateLimit | quote }}
- name: DD_TRACE_PROPAGATION_STYLE
  value: {{ .root.Values.observability.datadog.apm.propagationStyle | quote }}
- name: DD_LOGS_INJECTION
  value: {{ .root.Values.observability.datadog.apm.logsInjection | quote }}
- name: DD_RUNTIME_METRICS_ENABLED
  value: {{ .root.Values.observability.datadog.apm.runtimeMetrics | quote }}
- name: DD_PROFILING_ENABLED
  value: {{ .root.Values.observability.datadog.apm.profiling | quote }}
{{- end -}}
