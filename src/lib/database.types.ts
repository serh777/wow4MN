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
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      tool_data: {
        Row: {
          id: string
          user_id: string
          project_name: string
          project_url: string
          tool_id: string
          analysis_data: Json | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_name: string
          project_url: string
          tool_id: string
          analysis_data?: Json | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_name?: string
          project_url?: string
          tool_id?: string
          analysis_data?: Json | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tool_data_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      metadata_analysis: {
        Row: {
          id: string
          user_id: string
          project_name: string
          project_url: string
          title: string | null
          description: string | null
          keywords: string[] | null
          og_tags: Json | null
          twitter_tags: Json | null
          schema_markup: Json | null
          overall_score: number | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_name: string
          project_url: string
          title?: string | null
          description?: string | null
          keywords?: string[] | null
          og_tags?: Json | null
          twitter_tags?: Json | null
          schema_markup?: Json | null
          overall_score?: number | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_name?: string
          project_url?: string
          title?: string | null
          description?: string | null
          keywords?: string[] | null
          og_tags?: Json | null
          twitter_tags?: Json | null
          schema_markup?: Json | null
          overall_score?: number | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "metadata_analysis_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      content_audit: {
        Row: {
          id: string
          user_id: string
          project_name: string
          project_url: string
          content_quality: Json | null
          readability: Json | null
          structure: Json | null
          images: Json | null
          links: Json | null
          overall_score: number | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_name: string
          project_url: string
          content_quality?: Json | null
          readability?: Json | null
          structure?: Json | null
          images?: Json | null
          links?: Json | null
          overall_score?: number | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_name?: string
          project_url?: string
          content_quality?: Json | null
          readability?: Json | null
          structure?: Json | null
          images?: Json | null
          links?: Json | null
          overall_score?: number | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_audit_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      keyword_analysis: {
        Row: {
          id: string
          user_id: string
          project_name: string
          project_url: string
          primary_keywords: string[] | null
          secondary_keywords: string[] | null
          keyword_density: Json | null
          competitor_keywords: Json | null
          suggestions: Json | null
          overall_score: number | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_name: string
          project_url: string
          primary_keywords?: string[] | null
          secondary_keywords?: string[] | null
          keyword_density?: Json | null
          competitor_keywords?: Json | null
          suggestions?: Json | null
          overall_score?: number | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_name?: string
          project_url?: string
          primary_keywords?: string[] | null
          secondary_keywords?: string[] | null
          keyword_density?: Json | null
          competitor_keywords?: Json | null
          suggestions?: Json | null
          overall_score?: number | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "keyword_analysis_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      link_verification: {
        Row: {
          id: string
          user_id: string
          project_name: string
          project_url: string
          internal_links: Json | null
          external_links: Json | null
          broken_links: Json | null
          redirect_chains: Json | null
          anchor_text_analysis: Json | null
          overall_score: number | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_name: string
          project_url: string
          internal_links?: Json | null
          external_links?: Json | null
          broken_links?: Json | null
          redirect_chains?: Json | null
          anchor_text_analysis?: Json | null
          overall_score?: number | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_name?: string
          project_url?: string
          internal_links?: Json | null
          external_links?: Json | null
          broken_links?: Json | null
          redirect_chains?: Json | null
          anchor_text_analysis?: Json | null
          overall_score?: number | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "link_verification_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      performance_analysis: {
        Row: {
          id: string
          user_id: string
          project_name: string
          project_url: string
          core_web_vitals: Json | null
          lighthouse_scores: Json | null
          page_speed: Json | null
          mobile_performance: Json | null
          recommendations: Json | null
          overall_score: number | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_name: string
          project_url: string
          core_web_vitals?: Json | null
          lighthouse_scores?: Json | null
          page_speed?: Json | null
          mobile_performance?: Json | null
          recommendations?: Json | null
          overall_score?: number | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_name?: string
          project_url?: string
          core_web_vitals?: Json | null
          lighthouse_scores?: Json | null
          page_speed?: Json | null
          mobile_performance?: Json | null
          recommendations?: Json | null
          overall_score?: number | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "performance_analysis_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      competition_analysis: {
        Row: {
          id: string
          user_id: string
          project_name: string
          project_url: string
          competitors: Json | null
          market_position: Json | null
          strengths: Json | null
          weaknesses: Json | null
          opportunities: Json | null
          overall_score: number | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_name: string
          project_url: string
          competitors?: Json | null
          market_position?: Json | null
          strengths?: Json | null
          weaknesses?: Json | null
          opportunities?: Json | null
          overall_score?: number | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_name?: string
          project_url?: string
          competitors?: Json | null
          market_position?: Json | null
          strengths?: Json | null
          weaknesses?: Json | null
          opportunities?: Json | null
          overall_score?: number | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "competition_analysis_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      blockchain_analysis: {
        Row: {
          id: string
          user_id: string
          project_name: string
          project_url: string
          contract_address: string | null
          network: string | null
          token_metrics: Json | null
          security_analysis: Json | null
          liquidity_analysis: Json | null
          holder_analysis: Json | null
          transaction_analysis: Json | null
          overall_score: number | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_name: string
          project_url: string
          contract_address?: string | null
          network?: string | null
          token_metrics?: Json | null
          security_analysis?: Json | null
          liquidity_analysis?: Json | null
          holder_analysis?: Json | null
          transaction_analysis?: Json | null
          overall_score?: number | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_name?: string
          project_url?: string
          contract_address?: string | null
          network?: string | null
          token_metrics?: Json | null
          security_analysis?: Json | null
          liquidity_analysis?: Json | null
          holder_analysis?: Json | null
          transaction_analysis?: Json | null
          overall_score?: number | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blockchain_analysis_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      ai_assistant_dashboard: {
        Row: {
          id: string
          user_id: string
          project_name: string
          project_url: string
          ai_insights: Json | null
          recommendations: Json | null
          action_items: Json | null
          priority_tasks: Json | null
          progress_tracking: Json | null
          overall_score: number | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_name: string
          project_url: string
          ai_insights?: Json | null
          recommendations?: Json | null
          action_items?: Json | null
          priority_tasks?: Json | null
          progress_tracking?: Json | null
          overall_score?: number | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_name?: string
          project_url?: string
          ai_insights?: Json | null
          recommendations?: Json | null
          action_items?: Json | null
          priority_tasks?: Json | null
          progress_tracking?: Json | null
          overall_score?: number | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_assistant_dashboard_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      social_web3_analysis: {
        Row: {
          id: string
          user_id: string
          address: string
          network: string
          platforms: Json | null
          activity: Json | null
          followers: Json | null
          content: Json | null
          engagement: Json | null
          influence: Json | null
          overall_score: number | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          address: string
          network: string
          platforms?: Json | null
          activity?: Json | null
          followers?: Json | null
          content?: Json | null
          engagement?: Json | null
          influence?: Json | null
          overall_score?: number | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          address?: string
          network?: string
          platforms?: Json | null
          activity?: Json | null
          followers?: Json | null
          content?: Json | null
          engagement?: Json | null
          influence?: Json | null
          overall_score?: number | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_web3_analysis_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      indexers: {
        Row: {
          id: string
          name: string
          description: string | null
          status: string
          last_run: string | null
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          status?: string
          last_run?: string | null
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          status?: string
          last_run?: string | null
          created_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "indexers_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      indexer_jobs: {
        Row: {
          id: string
          indexer_id: string
          status: string
          started_at: string | null
          completed_at: string | null
          error: string | null
          result: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          indexer_id: string
          status?: string
          started_at?: string | null
          completed_at?: string | null
          error?: string | null
          result?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          indexer_id?: string
          status?: string
          started_at?: string | null
          completed_at?: string | null
          error?: string | null
          result?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "indexer_jobs_indexer_id_fkey"
            columns: ["indexer_id"]
            referencedRelation: "indexers"
            referencedColumns: ["id"]
          }
        ]
      }
      indexer_configs: {
        Row: {
          id: string
          indexer_id: string
          key: string
          value: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          indexer_id: string
          key: string
          value: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          indexer_id?: string
          key?: string
          value?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "indexer_configs_indexer_id_fkey"
            columns: ["indexer_id"]
            referencedRelation: "indexers"
            referencedColumns: ["id"]
          }
        ]
      }
      blocks: {
        Row: {
          id: string
          block_number: number
          block_hash: string
          timestamp: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          block_number: number
          block_hash: string
          timestamp: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          block_number?: number
          block_hash?: string
          timestamp?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          id: string
          tx_hash: string
          block_id: string
          from_address: string
          to_address: string | null
          value: string
          gas_used: number
          gas_price: string
          input: string | null
          status: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tx_hash: string
          block_id: string
          from_address: string
          to_address?: string | null
          value: string
          gas_used: number
          gas_price: string
          input?: string | null
          status?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tx_hash?: string
          block_id?: string
          from_address?: string
          to_address?: string | null
          value?: string
          gas_used?: number
          gas_price?: string
          input?: string | null
          status?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_block_id_fkey"
            columns: ["block_id"]
            referencedRelation: "blocks"
            referencedColumns: ["id"]
          }
        ]
      }
      events: {
        Row: {
          id: string
          transaction_id: string
          address: string
          event_name: string
          topics: string[] | null
          data: string | null
          log_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          transaction_id: string
          address: string
          event_name: string
          topics?: string[] | null
          data?: string | null
          log_index: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          transaction_id?: string
          address?: string
          event_name?: string
          topics?: string[] | null
          data?: string | null
          log_index?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_transaction_id_fkey"
            columns: ["transaction_id"]
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          }
        ]
      }
      tool_payments: {
        Row: {
          id: string
          user_id: string
          tool_id: string
          tool_name: string
          amount: string
          token_address: string
          token_symbol: string
          tx_hash: string
          block_number: number | null
          network: string
          status: string
          plan_id: number | null
          discount: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tool_id: string
          tool_name: string
          amount: string
          token_address: string
          token_symbol: string
          tx_hash: string
          block_number?: number | null
          network: string
          status?: string
          plan_id?: number | null
          discount?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tool_id?: string
          tool_name?: string
          amount?: string
          token_address?: string
          token_symbol?: string
          tx_hash?: string
          block_number?: number | null
          network?: string
          status?: string
          plan_id?: number | null
          discount?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tool_payments_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_settings: {
        Row: {
          id: string
          user_id: string
          preferred_network: string
          preferred_token: string
          notifications: Json
          theme: string
          language: string
          timezone: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          preferred_network?: string
          preferred_token?: string
          notifications?: Json
          theme?: string
          language?: string
          timezone?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          preferred_network?: string
          preferred_token?: string
          notifications?: Json
          theme?: string
          language?: string
          timezone?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      tool_action_history: {
        Row: {
          id: string
          user_id: string
          tool_id: string
          tool_name: string
          action: string
          description: string
          resource_id: string | null
          metadata: Json | null
          tx_hash: string | null
          network: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tool_id: string
          tool_name: string
          action: string
          description: string
          resource_id?: string | null
          metadata?: Json | null
          tx_hash?: string | null
          network?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tool_id?: string
          tool_name?: string
          action?: string
          description?: string
          resource_id?: string | null
          metadata?: Json | null
          tx_hash?: string | null
          network?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tool_action_history_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_privacy_settings: {
        Row: {
          id: string
          user_id: string
          save_analysis_history: boolean
          save_search_queries: boolean
          save_usage_metrics: boolean
          enable_personalization: boolean
          data_retention_days: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          save_analysis_history?: boolean
          save_search_queries?: boolean
          save_usage_metrics?: boolean
          enable_personalization?: boolean
          data_retention_days?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          save_analysis_history?: boolean
          save_search_queries?: boolean
          save_usage_metrics?: boolean
          enable_personalization?: boolean
          data_retention_days?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_privacy_settings_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      wallet_sessions: {
        Row: {
          id: string
          hashed_wallet_address: string
          user_id: string | null
          session_start: string
          session_end: string | null
          created_at: string
        }
        Insert: {
          id?: string
          hashed_wallet_address: string
          user_id?: string | null
          session_start?: string
          session_end?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          hashed_wallet_address?: string
          user_id?: string | null
          session_start?: string
          session_end?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_sessions_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      analysis_history: {
        Row: {
          id: string
          user_id: string
          tool_name: string
          project_url: string
          analysis_data: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tool_name: string
          project_url: string
          analysis_data: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tool_name?: string
          project_url?: string
          analysis_data?: Json
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "analysis_history_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      search_queries: {
        Row: {
          id: string
          user_id: string
          query: string
          results_count: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          query: string
          results_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          query?: string
          results_count?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "search_queries_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      usage_metrics: {
        Row: {
          id: string
          user_id: string
          metric_name: string
          metric_value: number
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          metric_name: string
          metric_value: number
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          metric_name?: string
          metric_value?: number
          metadata?: Json | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "usage_metrics_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      analysis_summary: {
        Row: {
          id: string
          user_id: string
          project_name: string
          project_url: string
          total_analyses: number
          average_score: number
          last_analysis: string | null
          tools_used: Json
          improvements: Json
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_name: string
          project_url: string
          total_analyses?: number
          average_score?: number
          last_analysis?: string | null
          tools_used?: Json
          improvements?: Json
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_name?: string
          project_url?: string
          total_analyses?: number
          average_score?: number
          last_analysis?: string | null
          tools_used?: Json
          improvements?: Json
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "analysis_summary_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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