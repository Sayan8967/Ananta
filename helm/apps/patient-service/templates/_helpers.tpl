{{/*
Expand the name of the chart.
*/}}
{{- define "patient-service.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
*/}}
{{- define "patient-service.fullname" -}}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}{{- .Release.Name | trunc 63 | trimSuffix "-" }}{{- else }}{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}{{- end }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "patient-service.labels" -}}
helm.sh/chart: {{ include "patient-service.name" . }}-{{ .Chart.Version }}
app.kubernetes.io/name: {{ include "patient-service.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "patient-service.selectorLabels" -}}
app.kubernetes.io/name: {{ include "patient-service.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "patient-service.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "patient-service.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}
