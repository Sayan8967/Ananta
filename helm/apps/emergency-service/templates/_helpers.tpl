{{/*
Expand the name of the chart.
*/}}
{{- define "emergency-service.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
*/}}
{{- define "emergency-service.fullname" -}}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}{{- .Release.Name | trunc 63 | trimSuffix "-" }}{{- else }}{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}{{- end }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "emergency-service.labels" -}}
helm.sh/chart: {{ include "emergency-service.name" . }}-{{ .Chart.Version }}
app.kubernetes.io/name: {{ include "emergency-service.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "emergency-service.selectorLabels" -}}
app.kubernetes.io/name: {{ include "emergency-service.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "emergency-service.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "emergency-service.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}
