export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tool_data: {
        Row: {
          id: number
          user_id: string | null
          tool_name: string
          input_data: any
          output_data: any | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id?: string | null
          tool_name: string
          input_data: any
          output_data?: any | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string | null
          tool_name?: string
          input_data?: any
          output_data?: any | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      indexers: {
        Row: {
          id: number
          name: string
          description: string | null
          contract_address: string
          abi: any
          start_block: number
          current_block: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          description?: string | null
          contract_address: string
          abi: any
          start_block?: number
          current_block?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string | null
          contract_address?: string
          abi?: any
          start_block?: number
          current_block?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      indexer_jobs: {
        Row: {
          id: number
          indexer_id: number | null
          from_block: number
          to_block: number
          status: string
          error_message: string | null
          processed_events: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          indexer_id?: number | null
          from_block: number
          to_block: number
          status?: string
          error_message?: string | null
          processed_events?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          indexer_id?: number | null
          from_block?: number
          to_block?: number
          status?: string
          error_message?: string | null
          processed_events?: number
          created_at?: string
          updated_at?: string
        }
      }
      indexer_configs: {
        Row: {
          id: number
          indexer_id: number | null
          key: string
          value: string
          created_at: string
        }
        Insert: {
          id?: number
          indexer_id?: number | null
          key: string
          value: string
          created_at?: string
        }
        Update: {
          id?: number
          indexer_id?: number | null
          key?: string
          value?: string
          created_at?: string
        }
      }
      blocks: {
        Row: {
          id: number
          block_number: number
          block_hash: string
          parent_hash: string
          timestamp: string
          gas_limit: number
          gas_used: number
          miner: string
          difficulty: number | null
          total_difficulty: number | null
          size: number | null
          transaction_count: number
          created_at: string
        }
        Insert: {
          id?: number
          block_number: number
          block_hash: string
          parent_hash: string
          timestamp: string
          gas_limit: number
          gas_used: number
          miner: string
          difficulty?: number | null
          total_difficulty?: number | null
          size?: number | null
          transaction_count?: number
          created_at?: string
        }
        Update: {
          id?: number
          block_number?: number
          block_hash?: string
          parent_hash?: string
          timestamp?: string
          gas_limit?: number
          gas_used?: number
          miner?: string
          difficulty?: number | null
          total_difficulty?: number | null
          size?: number | null
          transaction_count?: number
          created_at?: string
        }
      }
      transactions: {
        Row: {
          id: number
          hash: string
          block_id: number | null
          block_number: number
          transaction_index: number
          from_address: string
          to_address: string | null
          value: string
          gas_limit: number
          gas_used: number | null
          gas_price: number | null
          max_fee_per_gas: number | null
          max_priority_fee_per_gas: number | null
          nonce: number
          input_data: string | null
          status: number | null
          created_at: string
        }
        Insert: {
          id?: number
          hash: string
          block_id?: number | null
          block_number: number
          transaction_index: number
          from_address: string
          to_address?: string | null
          value: string
          gas_limit: number
          gas_used?: number | null
          gas_price?: number | null
          max_fee_per_gas?: number | null
          max_priority_fee_per_gas?: number | null
          nonce: number
          input_data?: string | null
          status?: number | null
          created_at?: string
        }
        Update: {
          id?: number
          hash?: string
          block_id?: number | null
          block_number?: number
          transaction_index?: number
          from_address?: string
          to_address?: string | null
          value?: string
          gas_limit?: number
          gas_used?: number | null
          gas_price?: number | null
          max_fee_per_gas?: number | null
          max_priority_fee_per_gas?: number | null
          nonce?: number
          input_data?: string | null
          status?: number | null
          created_at?: string
        }
      }
      events: {
        Row: {
          id: number
          transaction_id: number | null
          indexer_id: number | null
          contract_address: string
          event_name: string
          event_signature: string
          log_index: number
          block_number: number
          transaction_hash: string
          data: any
          topics: string[]
          created_at: string
        }
        Insert: {
          id?: number
          transaction_id?: number | null
          indexer_id?: number | null
          contract_address: string
          event_name: string
          event_signature: string
          log_index: number
          block_number: number
          transaction_hash: string
          data: any
          topics: string[]
          created_at?: string
        }
        Update: {
          id?: number
          transaction_id?: number | null
          indexer_id?: number | null
          contract_address?: string
          event_name?: string
          event_signature?: string
          log_index?: number
          block_number?: number
          transaction_hash?: string
          data?: any
          topics?: string[]
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type User = Database['public']['Tables']['users']['Row']
export type ToolData = Database['public']['Tables']['tool_data']['Row']
export type Indexer = Database['public']['Tables']['indexers']['Row']
export type IndexerJob = Database['public']['Tables']['indexer_jobs']['Row']
export type IndexerConfig = Database['public']['Tables']['indexer_configs']['Row']
export type Block = Database['public']['Tables']['blocks']['Row']
export type Transaction = Database['public']['Tables']['transactions']['Row']
export type Event = Database['public']['Tables']['events']['Row']