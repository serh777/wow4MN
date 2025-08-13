'use client';

import * as React from 'react';

interface PerformanceComparisonProps {
  comparison: {
    gasUsed: {
      project: number;
      network: number;
      difference: string;
    };
    confirmationTime: {
      project: number;
      network: number;
      difference: string;
    };
  };
}

export function PerformanceComparison({ comparison }: PerformanceComparisonProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Comparativa con Promedios de la Red</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-4">Métrica</th>
              <th className="text-center py-2 px-4">Tu Proyecto</th>
              <th className="text-center py-2 px-4">Promedio de la Red</th>
              <th className="text-center py-2 px-4">Diferencia</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2 px-4">Gas Utilizado</td>
              <td className="py-2 px-4 text-center">{comparison.gasUsed.project.toLocaleString()}</td>
              <td className="py-2 px-4 text-center">{comparison.gasUsed.network.toLocaleString()}</td>
              <td className={`py-2 px-4 text-center ${
                parseFloat(comparison.gasUsed.difference) < 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {comparison.gasUsed.difference}
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4">Tiempo de Confirmación</td>
              <td className="py-2 px-4 text-center">{comparison.confirmationTime.project}s</td>
              <td className="py-2 px-4 text-center">{comparison.confirmationTime.network}s</td>
              <td className={`py-2 px-4 text-center ${
                parseFloat(comparison.confirmationTime.difference) < 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {comparison.confirmationTime.difference}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}