'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Tipos para los campos de formulario
export interface UrlFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export interface AnalysisTypeFieldProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

export interface CheckboxFieldProps {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

/**
 * Campo de URL común para formularios de análisis
 */
export function UrlField({ value, onChange, placeholder = "https://ejemplo.com", required = true }: UrlFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="url">URL a analizar {required && <span className="text-red-500">*</span>}</Label>
      <Input
        id="url"
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}

/**
 * Campo de tipo de análisis común
 */
export function AnalysisTypeField({ value, onChange, options }: AnalysisTypeFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="analysisType">Tipo de análisis</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Selecciona el tipo de análisis" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

/**
 * Campo de checkbox con descripción
 */
export function CheckboxField({ id, label, description, checked, onChange }: CheckboxFieldProps) {
  return (
    <div className="flex items-start space-x-2">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={onChange}
      />
      <div className="grid gap-1.5 leading-none">
        <Label
          htmlFor={id}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </Label>
        {description && (
          <p className="text-xs text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Campo de área de texto común
 */
export function TextAreaField({ label, value, onChange, placeholder, rows = 3 }: TextAreaFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="textarea">{label}</Label>
      <Textarea
        id="textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
      />
    </div>
  );
}

/**
 * Contenedor de opciones con tabs
 */
export function OptionsTabsContainer({ children }: { children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Opciones de Análisis</CardTitle>
        <CardDescription>
          Configura las opciones específicas para tu análisis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Básico</TabsTrigger>
            <TabsTrigger value="advanced">Avanzado</TabsTrigger>
          </TabsList>
          {children}
        </Tabs>
      </CardContent>
    </Card>
  );
}

/**
 * Contenido de tab básico
 */
export function BasicTabContent({ children }: { children: React.ReactNode }) {
  return (
    <TabsContent value="basic" className="space-y-4">
      {children}
    </TabsContent>
  );
}

/**
 * Contenido de tab avanzado
 */
export function AdvancedTabContent({ children }: { children: React.ReactNode }) {
  return (
    <TabsContent value="advanced" className="space-y-4">
      {children}
    </TabsContent>
  );
}

const AnalysisFormFields = {
  UrlField,
  AnalysisTypeField,
  CheckboxField,
  TextAreaField,
  OptionsTabsContainer,
  BasicTabContent,
  AdvancedTabContent
};

export default AnalysisFormFields;