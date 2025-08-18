// Servicio de Etherscan para datos blockchain reales
export interface EtherscanContractInfo {
  contractAddress: string;
  contractName: string;
  compilerVersion: string;
  optimizationUsed: string;
  runs: string;
  constructorArguments: string;
  evmVersion: string;
  library: string;
  licenseType: string;
  proxy: string;
  implementation: string;
  swarmSource: string;
}

export interface EtherscanTransaction {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  transactionIndex: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  isError: string;
  txreceipt_status: string;
  input: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  gasUsed: string;
  confirmations: string;
}

export interface EtherscanBalance {
  account: string;
  balance: string;
}

export class EtherscanService {
  private static readonly BASE_URL = 'https://api.etherscan.io/api';
  private static readonly API_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;

  static async getContractInfo(contractAddress: string): Promise<EtherscanContractInfo | null> {
    try {
      const url = `${this.BASE_URL}?module=contract&action=getsourcecode&address=${contractAddress}&apikey=${this.API_KEY}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status === '1' && data.result && data.result.length > 0) {
        const result = data.result[0];
        return {
          contractAddress,
          contractName: result.ContractName || 'Unknown',
          compilerVersion: result.CompilerVersion || 'Unknown',
          optimizationUsed: result.OptimizationUsed || '0',
          runs: result.Runs || '0',
          constructorArguments: result.ConstructorArguments || '',
          evmVersion: result.EVMVersion || 'Unknown',
          library: result.Library || '',
          licenseType: result.LicenseType || 'Unknown',
          proxy: result.Proxy || '0',
          implementation: result.Implementation || '',
          swarmSource: result.SwarmSource || ''
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching contract info from Etherscan:', error);
      return null;
    }
  }

  static async getContractTransactions(contractAddress: string, page: number = 1, offset: number = 100): Promise<EtherscanTransaction[]> {
    try {
      const url = `${this.BASE_URL}?module=account&action=txlist&address=${contractAddress}&startblock=0&endblock=99999999&page=${page}&offset=${offset}&sort=desc&apikey=${this.API_KEY}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status === '1' && data.result) {
        return data.result;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching transactions from Etherscan:', error);
      return [];
    }
  }

  static async getAccountBalance(address: string): Promise<string> {
    try {
      const url = `${this.BASE_URL}?module=account&action=balance&address=${address}&tag=latest&apikey=${this.API_KEY}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status === '1') {
        // Convert from wei to ETH
        const balanceInWei = data.result;
        const balanceInEth = (parseInt(balanceInWei) / Math.pow(10, 18)).toFixed(6);
        return balanceInEth;
      }
      
      return '0';
    } catch (error) {
      console.error('Error fetching balance from Etherscan:', error);
      return '0';
    }
  }

  static async getMultipleBalances(addresses: string[]): Promise<EtherscanBalance[]> {
    try {
      const addressList = addresses.join(',');
      const url = `${this.BASE_URL}?module=account&action=balancemulti&address=${addressList}&tag=latest&apikey=${this.API_KEY}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status === '1' && data.result) {
        return data.result.map((item: any) => ({
          account: item.account,
          balance: (parseInt(item.balance) / Math.pow(10, 18)).toFixed(6)
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching multiple balances from Etherscan:', error);
      return [];
    }
  }

  static async getContractABI(contractAddress: string): Promise<any[] | null> {
    try {
      const url = `${this.BASE_URL}?module=contract&action=getabi&address=${contractAddress}&apikey=${this.API_KEY}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status === '1' && data.result) {
        return JSON.parse(data.result);
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching ABI from Etherscan:', error);
      return null;
    }
  }

  static async getTokenInfo(contractAddress: string): Promise<any> {
    try {
      // Get token supply
      const supplyUrl = `${this.BASE_URL}?module=stats&action=tokensupply&contractaddress=${contractAddress}&apikey=${this.API_KEY}`;
      const supplyResponse = await fetch(supplyUrl);
      const supplyData = await supplyResponse.json();
      
      // Get contract info for token details
      const contractInfo = await this.getContractInfo(contractAddress);
      
      return {
        contractAddress,
        totalSupply: supplyData.status === '1' ? supplyData.result : '0',
        contractInfo,
        verified: contractInfo !== null
      };
    } catch (error) {
      console.error('Error fetching token info from Etherscan:', error);
      return null;
    }
  }

  static async getGasPrice(): Promise<string> {
    try {
      const url = `${this.BASE_URL}?module=gastracker&action=gasoracle&apikey=${this.API_KEY}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status === '1' && data.result) {
        return data.result.ProposeGasPrice || '20';
      }
      
      return '20';
    } catch (error) {
      console.error('Error fetching gas price from Etherscan:', error);
      return '20';
    }
  }

  static async getInternalTransactions(contractAddress: string): Promise<any[]> {
    try {
      const url = `${this.BASE_URL}?module=account&action=txlistinternal&address=${contractAddress}&startblock=0&endblock=99999999&page=1&offset=100&sort=desc&apikey=${this.API_KEY}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status === '1' && data.result) {
        return data.result;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching internal transactions from Etherscan:', error);
      return [];
    }
  }

  static async getERC20Transfers(contractAddress: string): Promise<any[]> {
    try {
      const url = `${this.BASE_URL}?module=account&action=tokentx&address=${contractAddress}&startblock=0&endblock=99999999&page=1&offset=100&sort=desc&apikey=${this.API_KEY}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status === '1' && data.result) {
        return data.result;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching ERC20 transfers from Etherscan:', error);
      return [];
    }
  }

  static async getERC721Transfers(contractAddress: string): Promise<any[]> {
    try {
      const url = `${this.BASE_URL}?module=account&action=tokennfttx&address=${contractAddress}&startblock=0&endblock=99999999&page=1&offset=100&sort=desc&apikey=${this.API_KEY}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status === '1' && data.result) {
        return data.result;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching ERC721 transfers from Etherscan:', error);
      return [];
    }
  }
}

export default EtherscanService;

