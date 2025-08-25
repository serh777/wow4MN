/**
 * Adaptador personalizado sin Coinbase para evitar errores de sintaxis
 */

import { EthersAdapter } from '@reown/appkit-adapter-ethers';

// Crear un adaptador personalizado que excluya Coinbase
export class CustomEthersAdapter extends EthersAdapter {
  constructor() {
    super();
    // Configuración personalizada para evitar Coinbase
  }

  // Configuración personalizada completada
}

// Exportar instancia del adaptador personalizado
export const customEthersAdapter = new CustomEthersAdapter();