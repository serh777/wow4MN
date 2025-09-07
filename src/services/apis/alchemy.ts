// Servicio de Alchemy para NFTs y datos blockchain avanzados
export interface AlchemyNFT {
  contract: {
    address: string;
    name: string;
    symbol: string;
    totalSupply?: string;
    tokenType: string;
  };
  tokenId: string;
  tokenType: string;
  title: string;
  description: string;
  timeLastUpdated: string;
  rawMetadata?: any;
  tokenUri?: {
    raw: string;
    gateway: string;
  };
  media?: Array<{
    raw: string;
    gateway: string;
    thumbnail?: string;
    format?: string;
    bytes?: number;
  }>;
  attributes?: Array<{
    value: any;
    trait_type: string;
    display_type?: string;
  }>;
}

export interface AlchemyNFTCollection {
  address: string;
  name: string;
  symbol: string;
  totalSupply: number;
  tokenType: string;
  contractDeployer: string;
  deployedBlockNumber: number;
  openSeaMetadata: {
    floorPrice: number;
    collectionName: string;
    safelistRequestStatus: string;
    imageUrl: string;
    description: string;
    externalUrl: string;
    twitterUsername: string;
    discordUrl: string;
    lastIngestedAt: string;
  };
}

export class AlchemyService {
  private static readonly BASE_URL = 'https://eth-mainnet.g.alchemy.com/v2';
  private static readonly API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;

  // Método de instancia para análisis de NFTs
  async getNFTAnalysis(address: string): Promise<any> {
    try {
      const [ownedNFTs, collectionAnalysis] = await Promise.all([
        AlchemyService.getNFTsForOwner(address),
        this.isContractAddress(address) ? AlchemyService.analyzeNFTCollection(address) : null
      ]);
      
      return {
        address,
        ownedNFTs: ownedNFTs.slice(0, 10), // Limitar a 10 NFTs para evitar respuestas muy grandes
        totalNFTs: ownedNFTs.length,
        collectionAnalysis,
        isCollection: this.isContractAddress(address),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error analyzing NFTs:', error);
      return { error: 'Failed to analyze NFT data' };
    }
  }

  private isContractAddress(address: string): boolean {
    // Verificación básica si es una dirección de contrato
    return address.length === 42 && address.startsWith('0x');
  }

  static async getNFTsForOwner(ownerAddress: string, contractAddresses?: string[]): Promise<AlchemyNFT[]> {
    try {
      const url = `${this.BASE_URL}/${this.API_KEY}/getNFTs`;
      const baseParams = {
        owner: ownerAddress,
        withMetadata: 'true',
        pageSize: '100'
      };

      const allParams = contractAddresses && contractAddresses.length > 0
        ? { ...baseParams, contractAddresses: JSON.stringify(contractAddresses) }
        : baseParams;

      const params = new URLSearchParams(allParams);

      const response = await fetch(`${url}?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const text = await response.text();
      let data;
      
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('Error parsing JSON response:', text.substring(0, 100));
        throw new Error('Invalid JSON response from Alchemy API');
      }

      if (data.ownedNfts) {
        return data.ownedNfts;
      }

      return [];
    } catch (error) {
      console.error('Error fetching NFTs from Alchemy:', error);
      return [];
    }
  }

  static async getNFTMetadata(contractAddress: string, tokenId: string): Promise<AlchemyNFT | null> {
    try {
      const url = `${this.BASE_URL}/${this.API_KEY}/getNFTMetadata`;
      const params = new URLSearchParams({
        contractAddress,
        tokenId,
        tokenType: 'erc721'
      });

      const response = await fetch(`${url}?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const responseText = await response.text();
      try {
        return JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parsing error in getNFTMetadata:', parseError);
        console.error('Response text:', responseText);
        throw new Error('Invalid JSON response from Alchemy API');
      }
    } catch (error) {
      console.error('Error fetching NFT metadata from Alchemy:', error);
      return null;
    }
  }

  static async getNFTsForCollection(contractAddress: string, startToken?: string): Promise<AlchemyNFT[]> {
    try {
      const url = `${this.BASE_URL}/${this.API_KEY}/getNFTsForCollection`;
      const baseParams = {
        contractAddress,
        withMetadata: 'true',
        limit: '100'
      };

      const allParams = startToken
        ? { ...baseParams, startToken }
        : baseParams;

      const params = new URLSearchParams(allParams);

      const response = await fetch(`${url}?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const responseText = await response.text();
      let data;
      
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parsing error in getNFTsForCollection:', parseError);
        console.error('Response text:', responseText);
        throw new Error('Invalid JSON response from Alchemy API');
      }

      if (data.nfts) {
        return data.nfts;
      }

      return [];
    } catch (error) {
      console.error('Error fetching collection NFTs from Alchemy:', error);
      return [];
    }
  }

  static async getContractMetadata(contractAddress: string): Promise<AlchemyNFTCollection | null> {
    try {
      const url = `${this.BASE_URL}/${this.API_KEY}/getContractMetadata`;
      const params = new URLSearchParams({
        contractAddress
      });

      const response = await fetch(`${url}?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const responseText = await response.text();
      let data;
      
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parsing error in getContractMetadata:', parseError);
        console.error('Response text:', responseText);
        throw new Error('Invalid JSON response from Alchemy API');
      }

      return data.contractMetadata || null;
    } catch (error) {
      console.error('Error fetching contract metadata from Alchemy:', error);
      return null;
    }
  }

  static async getOwnersForCollection(contractAddress: string): Promise<string[]> {
    try {
      const url = `${this.BASE_URL}/${this.API_KEY}/getOwnersForCollection`;
      const params = new URLSearchParams({
        contractAddress,
        withTokenBalances: 'false'
      });

      const response = await fetch(`${url}?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const responseText = await response.text();
      let data;
      
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parsing error in getOwnersForCollection:', parseError);
        console.error('Response text:', responseText);
        throw new Error('Invalid JSON response from Alchemy API');
      }

      if (data.ownerAddresses) {
        return data.ownerAddresses;
      }

      return [];
    } catch (error) {
      console.error('Error fetching owners from Alchemy:', error);
      return [];
    }
  }

  static async getFloorPrice(contractAddress: string): Promise<number> {
    try {
      const url = `${this.BASE_URL}/${this.API_KEY}/getFloorPrice`;
      const params = new URLSearchParams({
        contractAddress
      });

      const response = await fetch(`${url}?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const responseText = await response.text();
      let data;
      
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parsing error in getFloorPrice:', parseError);
        console.error('Response text:', responseText);
        throw new Error('Invalid JSON response from Alchemy API');
      }

      if (data.openSea && data.openSea.floorPrice) {
        return data.openSea.floorPrice;
      }

      return 0;
    } catch (error) {
      console.error('Error fetching floor price from Alchemy:', error);
      return 0;
    }
  }

  static async getNFTSales(contractAddress: string, tokenId?: string): Promise<any[]> {
    try {
      const url = `${this.BASE_URL}/${this.API_KEY}/getNFTSales`;
      const baseParams = {
        contractAddress,
        order: 'desc',
        limit: '100'
      };

      const allParams = tokenId
        ? { ...baseParams, tokenId }
        : baseParams;

      const params = new URLSearchParams(allParams);

      const response = await fetch(`${url}?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const responseText = await response.text();
      let data;
      
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parsing error in getNFTSales:', parseError);
        console.error('Response text:', responseText);
        throw new Error('Invalid JSON response from Alchemy API');
      }

      if (data.nftSales) {
        return data.nftSales;
      }

      return [];
    } catch (error) {
      console.error('Error fetching NFT sales from Alchemy:', error);
      return [];
    }
  }

  static async getTokenBalances(address: string): Promise<any[]> {
    try {
      const url = `${this.BASE_URL}/${this.API_KEY}/getTokenBalances`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: 1,
          jsonrpc: '2.0',
          method: 'alchemy_getTokenBalances',
          params: [address]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const responseText = await response.text();
      let data;
      
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parsing error in getTokenBalances:', parseError);
        console.error('Response text:', responseText);
        throw new Error('Invalid JSON response from Alchemy API');
      }

      if (data.result && data.result.tokenBalances) {
        return data.result.tokenBalances;
      }

      return [];
    } catch (error) {
      console.error('Error fetching token balances from Alchemy:', error);
      return [];
    }
  }

  static async getTokenMetadata(contractAddress: string): Promise<any> {
    try {
      const url = `${this.BASE_URL}/${this.API_KEY}/getTokenMetadata`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: 1,
          jsonrpc: '2.0',
          method: 'alchemy_getTokenMetadata',
          params: [contractAddress]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const responseText = await response.text();
      let data;
      
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parsing error in getTokenMetadata:', parseError);
        console.error('Response text:', responseText);
        throw new Error('Invalid JSON response from Alchemy API');
      }

      return data.result || null;
    } catch (error) {
      console.error('Error fetching token metadata from Alchemy:', error);
      return null;
    }
  }

  static async getAssetTransfers(fromAddress?: string, toAddress?: string, contractAddress?: string): Promise<any[]> {
    try {
      const url = `${this.BASE_URL}/${this.API_KEY}/getAssetTransfers`;
      
      const baseParams = {
        category: ['erc20', 'erc721', 'erc1155'],
        maxCount: '0x64', // 100 in hex
        order: 'desc'
      };

      const transferParams = {
        ...baseParams,
        ...(fromAddress && { fromAddress }),
        ...(toAddress && { toAddress }),
        ...(contractAddress && { contractAddresses: [contractAddress] })
      };

      const params: any = {
        id: 1,
        jsonrpc: '2.0',
        method: 'alchemy_getAssetTransfers',
        params: [transferParams]
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const responseText = await response.text();
      let data;
      
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parsing error in getAssetTransfers:', parseError);
        console.error('Response text:', responseText);
        throw new Error('Invalid JSON response from Alchemy API');
      }

      if (data.result && data.result.transfers) {
        return data.result.transfers;
      }

      return [];
    } catch (error) {
      console.error('Error fetching asset transfers from Alchemy:', error);
      return [];
    }
  }

  static async analyzeNFTCollection(contractAddress: string): Promise<any> {
    try {
      // Get collection metadata
      const contractMetadata = await this.getContractMetadata(contractAddress);
      
      // Get sample NFTs from collection
      const nfts = await this.getNFTsForCollection(contractAddress);
      
      // Get owners
      const owners = await this.getOwnersForCollection(contractAddress);
      
      // Get floor price
      const floorPrice = await this.getFloorPrice(contractAddress);
      
      // Get recent sales
      const sales = await this.getNFTSales(contractAddress);

      // Analyze attributes and rarity
      const attributeAnalysis = this.analyzeAttributes(nfts);

      return {
        contractAddress,
        metadata: contractMetadata,
        totalSupply: contractMetadata?.totalSupply || 0,
        uniqueOwners: owners.length,
        floorPrice,
        recentSales: sales.slice(0, 10),
        attributeAnalysis,
        sampleNFTs: nfts.slice(0, 10),
        marketMetrics: {
          totalVolume: sales.reduce((sum, sale) => sum + (parseFloat(sale.sellerFee?.amount || '0')), 0),
          averagePrice: sales.length > 0 ? sales.reduce((sum, sale) => sum + (parseFloat(sale.sellerFee?.amount || '0')), 0) / sales.length : 0,
          salesCount: sales.length
        }
      };
    } catch (error) {
      console.error('Error analyzing NFT collection:', error);
      return null;
    }
  }

  private static analyzeAttributes(nfts: AlchemyNFT[]): any {
    const attributeMap = new Map();
    const traitCounts = new Map();

    nfts.forEach(nft => {
      if (nft.attributes) {
        nft.attributes.forEach(attr => {
          const traitType = attr.trait_type;
          const value = attr.value;

          if (!attributeMap.has(traitType)) {
            attributeMap.set(traitType, new Map());
          }

          const valueMap = attributeMap.get(traitType);
          valueMap.set(value, (valueMap.get(value) || 0) + 1);

          traitCounts.set(traitType, (traitCounts.get(traitType) || 0) + 1);
        });
      }
    });

    const analysis = {
      totalTraitTypes: attributeMap.size,
      traitDistribution: {} as Record<string, Record<string, { count: number; rarity: number }>>,
      rarityScores: {} as Record<string, number>
    };

    // Convert maps to objects for JSON serialization
    attributeMap.forEach((valueMap, traitType) => {
      analysis.traitDistribution[traitType] = {};
      valueMap.forEach((count: number, value: string) => {
        analysis.traitDistribution[traitType][value] = {
          count,
          rarity: count / nfts.length
        };
      });
    });

    return analysis;
  }
}

export default AlchemyService;

