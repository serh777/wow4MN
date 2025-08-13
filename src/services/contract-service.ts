import { ethers } from 'ethers';
import { CONTRACT_ABI, CONTRACT_ADDRESSES, TOOL_IDS, TOOL_NAMES_TO_IDS, ACCEPTED_TOKENS } from '@/config/contract-config';
import { SUPPORTED_CHAINS } from '@/config/constants';
import { 
  detectMetaMask, 
  getMetaMaskState, 
  requestMetaMaskConnection, 
  handleWeb3Error,
  waitForMetaMask,
  isSupportedNetwork,
  hexToDecimal
} from '@/utils/web3-utils';

// Tipos para el estado de conexión
export interface ConnectionState {
  isConnected: boolean;
  isConnecting: boolean;
  chainId: number | null;
  account: string | null;
  error: string | null;
}

// Tipos para errores personalizados
export class Web3Error extends Error {
  code: string;
  originalError?: any;

  constructor(message: string, code: string, originalError?: any) {
    super(message);
    this.name = 'Web3Error';
    this.code = code;
    this.originalError = originalError;
  }
}

/**
 * Servicio mejorado para interactuar con el contrato inteligente DashboardToolsContract
 */
export class ContractService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  private contract: ethers.Contract | null = null;
  private chainId: number = SUPPORTED_CHAINS.ETHEREUM;
  private connectionState: ConnectionState = {
    isConnected: false,
    isConnecting: false,
    chainId: null,
    account: null,
    error: null
  };
  private listeners: ((state: ConnectionState) => void)[] = [];
  private maxRetries = 3;
  private retryDelay = 1000; // 1 segundo

  /**
   * Suscribirse a cambios en el estado de conexión
   */
  onConnectionStateChange(listener: (state: ConnectionState) => void): () => void {
    this.listeners.push(listener);
    // Retornar función para desuscribirse
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Actualizar estado de conexión y notificar a los listeners
   */
  private updateConnectionState(updates: Partial<ConnectionState>): void {
    this.connectionState = { ...this.connectionState, ...updates };
    this.listeners.forEach(listener => listener(this.connectionState));
  }

  /**
   * Obtener estado actual de conexión
   */
  getConnectionState(): ConnectionState {
    return { ...this.connectionState };
  }

  /**
   * Obtiene la dirección del token por defecto para la red actual
   */
  private getDefaultTokenAddress(): string {
    const tokensForChain = ACCEPTED_TOKENS[this.chainId];
    if (!tokensForChain) {
      throw new Web3Error(
        `No hay tokens configurados para la red ${this.chainId}`,
        'NO_TOKENS_FOR_CHAIN'
      );
    }
    
    // Preferir USDC, luego USDT, luego DAI
    return tokensForChain.USDC || tokensForChain.USDT || tokensForChain.DAI || Object.values(tokensForChain)[0];
  }

  /**
   * Detectar y cambiar a una red soportada
   */
  private async detectAndSwitchNetwork(): Promise<boolean> {
    try {
      const network = await this.provider!.getNetwork();
      const currentChainId = Number(network.chainId);
      
      console.log('Red actual detectada:', currentChainId);
      
      if (isSupportedNetwork(currentChainId, CONTRACT_ADDRESSES)) {
        this.chainId = currentChainId;
        this.updateConnectionState({ chainId: currentChainId });
        console.log('Red soportada confirmada:', currentChainId);
        return true;
      }

      console.warn('Red no soportada:', currentChainId, 'Intentando cambiar a una red soportada...');
      
      // Intentar cambiar a una red soportada (empezar con Ethereum mainnet)
      const supportedChains = [SUPPORTED_CHAINS.ETHEREUM, SUPPORTED_CHAINS.POLYGON, SUPPORTED_CHAINS.BSC];
      
      for (const chainId of supportedChains) {
        try {
          console.log(`Intentando cambiar a la red ${chainId}...`);
          await this.switchToNetwork(chainId);
          this.chainId = chainId;
          this.updateConnectionState({ chainId });
          console.log(`Cambiado exitosamente a la red ${chainId}`);
          return true;
        } catch (error) {
          console.warn(`No se pudo cambiar a la red ${chainId}:`, error);
        }
      }

      throw new Web3Error(
        `Red actual (${currentChainId}) no está soportada. Por favor cambia manualmente a Ethereum, Polygon o BSC en MetaMask.`,
        'UNSUPPORTED_NETWORK'
      );
    } catch (error) {
      if (error instanceof Web3Error) {
        throw error;
      }
      throw new Web3Error(
        'Error al detectar la red: ' + handleWeb3Error(error),
        'NETWORK_DETECTION_ERROR',
        error
      );
    }
  }

  /**
   * Cambiar a una red específica
   */
  private async switchToNetwork(chainId: number): Promise<void> {
    const chainIdHex = `0x${chainId.toString(16)}`;
    
    if (!window.ethereum) {
      throw new Error('MetaMask no está disponible');
    }
    
    try {
      await (window.ethereum as any).request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }],
      });
    } catch (switchError: any) {
      // Si la red no está agregada, intentar agregarla
      if (switchError.code === 4902) {
        await this.addNetwork(chainId);
      } else {
        throw switchError;
      }
    }
  }

  /**
   * Agregar una nueva red a MetaMask
   */
  private async addNetwork(chainId: number): Promise<void> {
    const networkConfigs: Record<number, any> = {
      [SUPPORTED_CHAINS.POLYGON]: {
        chainId: '0x89',
        chainName: 'Polygon Mainnet',
        nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
        rpcUrls: ['https://polygon-rpc.com/'],
        blockExplorerUrls: ['https://polygonscan.com/']
      },
      [SUPPORTED_CHAINS.BSC]: {
        chainId: '0x38',
        chainName: 'BNB Smart Chain',
        nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
        rpcUrls: ['https://bsc-dataseed.binance.org/'],
        blockExplorerUrls: ['https://bscscan.com/']
      },
      [SUPPORTED_CHAINS.AVALANCHE]: {
        chainId: '0xa86a',
        chainName: 'Avalanche Network',
        nativeCurrency: { name: 'AVAX', symbol: 'AVAX', decimals: 18 },
        rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
        blockExplorerUrls: ['https://snowtrace.io/']
      }
    };

    const config = networkConfigs[chainId];
    if (config && window.ethereum) {
      await (window.ethereum as any).request({
        method: 'wallet_addEthereumChain',
        params: [config],
      });
    }
  }

  /**
   * Lógica de reintentos para operaciones fallidas
   */
  private async retryOperation<T>(
    operation: () => Promise<T>,
    operationName: string,
    maxRetries: number = this.maxRetries
  ): Promise<T> {
    let lastError: any;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error: any) {
        lastError = error;
        console.warn(`Intento ${attempt}/${maxRetries} falló para ${operationName}:`, error);
        
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
        }
      }
    }
    
    throw new Web3Error(
      `Operación ${operationName} falló después de ${maxRetries} intentos`,
      'MAX_RETRIES_EXCEEDED',
      lastError
    );
  }

  /**
   * Inicializa el servicio con manejo mejorado de errores y estado
   */
  async initialize(): Promise<boolean> {
    this.updateConnectionState({ isConnecting: true, error: null });

    try {
      // Esperar a que MetaMask esté disponible
      const metaMaskAvailable = await waitForMetaMask(5000);
      if (!metaMaskAvailable) {
        throw new Web3Error(
          'MetaMask no está instalado o no está disponible. Por favor instala MetaMask desde https://metamask.io/',
          'METAMASK_NOT_AVAILABLE'
        );
      }

      // Verificar estado de MetaMask
      const metaMaskState = await getMetaMaskState();
      if (!metaMaskState.isInstalled) {
        throw new Web3Error(
          'MetaMask no está instalado correctamente',
          'METAMASK_NOT_INSTALLED'
        );
      }

      // Solicitar conexión si no está conectado
      let accounts: string[] = [];
      if (!metaMaskState.isConnected) {
        const connectionResult = await requestMetaMaskConnection();
        if (!connectionResult.success) {
          throw new Web3Error(
            connectionResult.error || 'Error al conectar con MetaMask',
            'CONNECTION_FAILED'
          );
        }
        accounts = connectionResult.accounts || [];
      } else {
        accounts = metaMaskState.accounts;
      }

      if (accounts.length === 0) {
        throw new Web3Error(
          'No se obtuvieron cuentas de MetaMask',
          'NO_ACCOUNTS'
        );
      }

      // Crear proveedor
      this.provider = new ethers.BrowserProvider(window.ethereum as any);
      
      // Configurar listeners de eventos
      this.setupEventListeners();

      // Detectar y cambiar a red soportada
      await this.detectAndSwitchNetwork();

      // Obtener signer y cuenta
      this.signer = await this.provider.getSigner();
      const account = await this.signer.getAddress();

      // Verificar que tenemos una dirección de contrato para esta red
      if (!CONTRACT_ADDRESSES[this.chainId]) {
        throw new Web3Error(
          `Red ${this.chainId} no está soportada`,
          'UNSUPPORTED_NETWORK'
        );
      }

      // Crear instancia del contrato
      this.contract = new ethers.Contract(
        CONTRACT_ADDRESSES[this.chainId],
        CONTRACT_ABI,
        this.signer
      );

      this.updateConnectionState({
        isConnected: true,
        isConnecting: false,
        account,
        chainId: this.chainId,
        error: null
      });

      console.log('ContractService inicializado correctamente:', {
        account,
        chainId: this.chainId,
        contractAddress: CONTRACT_ADDRESSES[this.chainId]
      });

      return true;
    } catch (error: any) {
      const errorMessage = error instanceof Web3Error ? error.message : handleWeb3Error(error);

      this.updateConnectionState({
        isConnected: false,
        isConnecting: false,
        error: errorMessage
      });

      console.error('Error al inicializar el servicio de contrato:', {
        error,
        message: errorMessage,
        code: error.code
      });
      return false;
    }
  }

  /**
   * Configurar listeners para eventos de MetaMask
   */
  private setupEventListeners(): void {
    if (!window.ethereum) return;

    // Cambio de red
    (window.ethereum as any).on('chainChanged', async (chainId: string) => {
      const newChainId = parseInt(chainId, 16);
      this.chainId = newChainId;
      
      if (CONTRACT_ADDRESSES[newChainId]) {
        this.updateConnectionState({ chainId: newChainId, error: null });
        // Reinicializar contrato para la nueva red
        if (this.signer) {
          this.contract = new ethers.Contract(
            CONTRACT_ADDRESSES[newChainId],
            CONTRACT_ABI,
            this.signer
          );
        }
      } else {
        this.updateConnectionState({ 
          chainId: newChainId, 
          error: `Red ${newChainId} no soportada` 
        });
      }
    });

    // Cambio de cuenta
    (window.ethereum as any).on('accountsChanged', async (accounts: string[]) => {
      if (accounts.length === 0) {
        this.updateConnectionState({
          isConnected: false,
          account: null,
          error: 'Usuario desconectó MetaMask'
        });
      } else {
        const newAccount = accounts[0];
        this.updateConnectionState({ account: newAccount });
        
        // Actualizar signer si es necesario
        if (this.provider) {
          this.signer = await this.provider.getSigner();
          if (this.contract) {
            this.contract = new ethers.Contract(
              CONTRACT_ADDRESSES[this.chainId],
              CONTRACT_ABI,
              this.signer
            );
          }
        }
      }
    });

    // Desconexión
    (window.ethereum as any).on('disconnect', () => {
      this.updateConnectionState({
        isConnected: false,
        account: null,
        error: 'Desconectado de MetaMask'
      });
    });
  }

  /**
   * Obtiene el precio de herramientas con manejo de errores mejorado
   */
  async getToolsPrice(toolNames: string[], tokenAddress?: string): Promise<{
    totalPriceBeforeDiscount: bigint;
    finalPrice: bigint;
    isCompleteAuditOffer: boolean;
  } | null> {
    try {
      console.log('getToolsPrice llamado con:', { toolNames, tokenAddress });
      
      if (!this.contract || !this.connectionState.isConnected) {
        console.log('Contrato no inicializado, inicializando...');
        const initialized = await this.initialize();
        if (!initialized) {
          throw new Web3Error('No se pudo inicializar la conexión', 'INITIALIZATION_FAILED');
        }
      }

      return await this.retryOperation(async () => {
        // Mapear nombres de herramientas a IDs
        const toolIds = toolNames.map(name => {
          const toolId = TOOL_NAMES_TO_IDS[name] || (TOOL_IDS as any)[name.toUpperCase()];
          if (!toolId) {
            throw new Error(`Herramienta '${name}' no encontrada en la configuración`);
          }
          return toolId;
        });
        
        // Validar que tenemos una dirección de contrato para esta red
        const contractAddress = CONTRACT_ADDRESSES[this.chainId];
        if (!contractAddress) {
          throw new Error(`No hay dirección de contrato configurada para la red ${this.chainId}`);
        }
        
        // Obtener dirección del token
        const token = tokenAddress || this.getDefaultTokenAddress();
        if (!token) {
          throw new Error(`No se pudo obtener dirección de token para la red ${this.chainId}`);
        }
        
        console.log('Llamando getToolsPrice con:', { 
          token, 
          toolIds, 
          contractAddress,
          chainId: this.chainId 
        });
        
        // Verificar que el contrato esté disponible
        if (!this.contract) {
          throw new Error('Contrato no disponible');
        }
        
        // Verificar que el signer esté disponible
        if (!this.signer) {
          throw new Error('Signer no disponible');
        }
        
        const result = await this.contract.getToolsPrice(token, toolIds);
        
        console.log('Resultado de getToolsPrice:', result);
        
        return {
          totalPriceBeforeDiscount: result[0],
          finalPrice: result[1],
          isCompleteAuditOffer: result[2]
        };
      }, 'obtener precio de herramientas');
    } catch (error: any) {
      const errorMessage = error instanceof Web3Error ? error.message : handleWeb3Error(error);
      
      // Log detallado del error
      console.error('Error al obtener el precio de las herramientas:', {
        errorType: error.constructor.name,
        errorMessage: error.message,
        errorCode: error.code,
        errorStack: error.stack,
        toolNames,
        tokenAddress,
        chainId: this.chainId,
        contractAddress: CONTRACT_ADDRESSES[this.chainId],
        isConnected: this.connectionState.isConnected,
        hasContract: !!this.contract,
        hasSigner: !!this.signer
      });
      
      this.updateConnectionState({ error: errorMessage });
      return null;
    }
  }

  /**
   * Realiza el pago con manejo de errores y reintentos mejorado
   */
  async payForTools(toolNames: string[], tokenAddress?: string): Promise<{
    success: boolean;
    transactionHash?: string;
    error?: string;
  }> {
    try {
      if (!this.contract || !this.connectionState.isConnected) {
        const initialized = await this.initialize();
        if (!initialized) {
          throw new Web3Error('No se pudo inicializar la conexión', 'INITIALIZATION_FAILED');
        }
      }

      return await this.retryOperation(async () => {
        const toolIds = toolNames.map(name => TOOL_NAMES_TO_IDS[name] || (TOOL_IDS as any)[name.toUpperCase()]);
        const token = tokenAddress || this.getDefaultTokenAddress();

        // Obtener precio
        const priceInfo = await this.getToolsPrice(toolNames, token);
        if (!priceInfo) {
          throw new Web3Error('No se pudo obtener el precio', 'PRICE_FETCH_FAILED');
        }

        // Aprobar token
        const tokenContract = new ethers.Contract(
          token,
          [
            'function approve(address spender, uint256 amount) public returns (bool)',
            'function allowance(address owner, address spender) public view returns (uint256)'
          ],
          this.signer!
        );

        const approveTx = await tokenContract.approve(
          CONTRACT_ADDRESSES[this.chainId],
          priceInfo.finalPrice
        );
        await approveTx.wait();

        // Realizar pago
        const tx = await this.contract!.payForTools(token, toolIds);
        const receipt = await tx.wait();

        return {
          success: true,
          transactionHash: receipt.hash
        };
      }, 'pagar por herramientas');
    } catch (error: any) {
      const errorMessage = error instanceof Web3Error ? error.message :
        error.code === 4001 ? 'Usuario canceló la transacción' :
        error.code === -32603 ? 'Error interno de la red' :
        'Error desconocido al procesar el pago';

      // Log detallado del error
      console.error('Error al pagar por las herramientas:', {
        errorType: error.constructor.name,
        errorMessage: error.message,
        errorCode: error.code,
        errorStack: error.stack,
        toolNames,
        tokenAddress,
        chainId: this.chainId,
        contractAddress: CONTRACT_ADDRESSES[this.chainId],
        isConnected: this.connectionState.isConnected,
        hasContract: !!this.contract,
        hasSigner: !!this.signer
      });
      
      this.updateConnectionState({ error: errorMessage });
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  /**
   * Emite acción de herramienta con manejo mejorado
   */
  async emitToolAction(
    toolName: string,
    actionType: string,
    resourceId: string,
    metadataURI: string = ''
  ): Promise<{ success: boolean; transactionHash?: string; error?: string }> {
    try {
      if (!this.contract || !this.connectionState.isConnected) {
        const initialized = await this.initialize();
        if (!initialized) {
          throw new Web3Error('No se pudo inicializar la conexión', 'INITIALIZATION_FAILED');
        }
      }

      return await this.retryOperation(async () => {
        const toolId = TOOL_NAMES_TO_IDS[toolName] || (TOOL_IDS as any)[toolName.toUpperCase()];
        const actionTypeBytes = ethers.keccak256(ethers.toUtf8Bytes(actionType));
        const userAddress = await this.signer!.getAddress();

        const tx = await this.contract!.emitToolAction(
          toolId,
          actionTypeBytes,
          userAddress,
          resourceId,
          metadataURI
        );
        const receipt = await tx.wait();

        return {
          success: true,
          transactionHash: receipt.hash
        };
      }, 'emitir acción de herramienta');
    } catch (error: any) {
      const errorMessage = error instanceof Web3Error ? error.message :
        'Error desconocido al emitir acción';

      console.error('Error al emitir acción de herramienta:', error);
      this.updateConnectionState({ error: errorMessage });
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }



  /**
   * Desconectar y limpiar estado
   */
  disconnect(): void {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.updateConnectionState({
      isConnected: false,
      isConnecting: false,
      chainId: null,
      account: null,
      error: null
    });
  }
}

// Exportar una instancia única del servicio
export const contractService = new ContractService();