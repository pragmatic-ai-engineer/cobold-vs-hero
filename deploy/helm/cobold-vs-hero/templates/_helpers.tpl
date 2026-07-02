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

{{- define "cobold-vs-hero.observabilityVersion" -}}
{{- default .Chart.AppVersion .Values.global.imageTag -}}
{{- end -}}

{{- define "cobold-vs-hero.frontendObservabilityRelease" -}}
{{- default (include "cobold-vs-hero.observabilityVersion" .) .Values.observability.frontend.release -}}
{{- end -}}

{{- define "cobold-vs-hero.observabilityEnv" -}}
{{- $root := .root -}}
{{- $component := .component -}}
- name: OTEL_SERVICE_NAME
  value: {{ printf "%s/Deployment/%s-%s" $root.Release.Namespace (include "cobold-vs-hero.fullname" $root) $component | quote }}
- name: POD_NAME
  valueFrom:
    fieldRef:
      fieldPath: metadata.name
- name: NODE_NAME
  valueFrom:
    fieldRef:
      fieldPath: spec.nodeName
- name: OTEL_RESOURCE_ATTRIBUTES
  value: {{ printf "host.name=$(NODE_NAME),container.id=%s/$(POD_NAME)/%s,service.namespace=%s,deployment.environment=%s,service.version=%s" $root.Release.Namespace $component $root.Values.observability.serviceNamespace $root.Values.observability.environment (include "cobold-vs-hero.observabilityVersion" $root) | quote }}
- name: OTEL_EXPORTER_OTLP_ENDPOINT
  value: {{ $root.Values.observability.opentelemetry.exporter.endpoint | quote }}
- name: OTEL_EXPORTER_OTLP_PROTOCOL
  value: {{ $root.Values.observability.opentelemetry.exporter.protocol | quote }}
- name: OTEL_PROPAGATORS
  value: {{ $root.Values.observability.opentelemetry.propagators | quote }}
{{- end -}}
