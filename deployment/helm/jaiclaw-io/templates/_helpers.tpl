{{/*
Expand the name of the chart.
*/}}
{{- define "jaiclaw-io.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "jaiclaw-io.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "jaiclaw-io.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "jaiclaw-io.labels" -}}
helm.sh/chart: {{ include "jaiclaw-io.chart" . }}
{{ include "jaiclaw-io.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "jaiclaw-io.selectorLabels" -}}
app.kubernetes.io/name: {{ include "jaiclaw-io.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "jaiclaw-io.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "jaiclaw-io.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Return the proper image name
*/}}
{{- define "jaiclaw-io.image" -}}
{{- $registryName := .Values.image.registry -}}
{{- $repositoryName := .Values.image.repository -}}
{{- $separator := ":" -}}
{{- $termination := .Values.image.tag | default .Chart.AppVersion | toString -}}
{{- if .Values.image.digest }}
    {{- $separator = "@" -}}
    {{- $termination = .Values.image.digest | toString -}}
{{- end -}}
{{- if .Values.global.imageRegistry }}
    {{- $registryName = .Values.global.imageRegistry -}}
{{- end -}}
{{- if $registryName }}
{{- printf "%s/%s%s%s" $registryName $repositoryName $separator $termination -}}
{{- else -}}
{{- printf "%s%s%s"  $repositoryName $separator $termination -}}
{{- end -}}
{{- end }}

{{/*
Return the proper image pull secrets
*/}}
{{- define "jaiclaw-io.imagePullSecrets" -}}
{{- $pullSecrets := list }}

{{- if .Values.global.imagePullSecrets }}
  {{- $pullSecrets = concat $pullSecrets .Values.global.imagePullSecrets }}
{{- end }}

{{- if .Values.image.pullSecrets }}
  {{- $pullSecrets = concat $pullSecrets .Values.image.pullSecrets }}
{{- end }}

{{- if (not (empty $pullSecrets)) }}
imagePullSecrets:
  {{- range $pullSecrets }}
  - name: {{ . }}
  {{- end }}
{{- end }}
{{- end }}
