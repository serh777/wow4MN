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

  static async getNFTsForOwner(ownerAddress: string, contractAddresses?: string[]): Promise<AlchemyNFT[]> {
    try {
      const url = `${this.BASE_URL}/${this.API_KEY}/getNFTs`;
      const params = new URLSearchParams({
        owner: ownerAddress,
        withMetadata: 'true',
        pageSize: '100'
      });

      if (contractAddresses && contractAddresses.length > 0) {
        params.append('contractAddresses', JSON.stringify(contractAddresses));
      }

      const response = await fetch(`${url}?${params}`);
      const data = await response.json();

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
      const data = await response.json();

      return data || null;
    } catch (error) {
      console.error('Error fetching NFT metadata from Alchemy:', error);
      return null;
    }
  }

  static async getNFTsForCollection(contractAddress: string, startToken?: string): Promise<AlchemyNFT[]> {
    try {
      const url = `${this.BASE_URL}/${this.API_KEY}/getNFTsForCollection`;
      const params = new URLSearchParams({
        contractAddress,
        withMetadata: 'true',
        limit: '100'
      });

      if (startToken) {
        params.append('startToken', startToken);
      }

      const response = await fetch(`${url}?${params}`);
      const data = await response.json();

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
      const data = await response.json();

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
      const data = await response.json();

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
      const data = await response.json();

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
      const params = new URLSearchParams({
        contractAddress,
        order: 'desc',
        limit: '100'
      });

      if (tokenId) {
        params.append('tokenId', tokenId);
      }

      const response = await fetch(`${url}?${params}`);
      const data = await response.json();

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

      const data = await response.json();

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

      const data = await response.json();

      return data.result || null;
    } catch (error) {
      console.error('Error fetching token metadata from Alchemy:', error);
      return null;
    }
  }

  static async getAssetTransfers(fromAddress?: string, toAddress?: string, contractAddress?: string): Promise<any[]> {
    try {
      const url = `${this.BASE_URL}/${this.API_KEY}/getAssetTransfers`;
      
      const params: any = {
        id: 1,
        jsonrpc: '2.0',
        method: 'alchemy_getAssetTransfers',
        params: [{
          category: ['erc20', 'erc721', 'erc1155'],
          maxCount: '0x64', // 100 in hex
          order: 'desc'
        }]
      };

      if (fromAddress) {
        params.params[0].fromAddress = fromAddress;
      }
      if (toAddress) {
        params.params[0].toAddress = toAddress;
      }
      if (contractAddress) {
        params.params[0].contractAddresses = [contractAddress];
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
      });

      const data = await response.json();

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
      traitDistribution: {},
      rarityScores: {}
    };

    // Convert maps to objects for JSON serialization
    attributeMap.forEach((valueMap, traitType) => {
      analysis.traitDistribution[traitType] = {};
      valueMap.forEach((count, value) => {
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

