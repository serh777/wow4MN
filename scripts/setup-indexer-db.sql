-- Script de configuración de base de datos para el Indexer
-- Ejecutar después de aplicar las migraciones de Prisma

-- Índices para optimizar consultas del indexer

-- Índices para la tabla Block
CREATE INDEX IF NOT EXISTS idx_block_number ON "Block"("number");
CREATE INDEX IF NOT EXISTS idx_block_timestamp ON "Block"("timestamp");
CREATE INDEX IF NOT EXISTS idx_block_miner ON "Block"("miner");

-- Índices para la tabla Transaction
CREATE INDEX IF NOT EXISTS idx_transaction_block ON "Transaction"("blockNumber");
CREATE INDEX IF NOT EXISTS idx_transaction_from ON "Transaction"("from");
CREATE INDEX IF NOT EXISTS idx_transaction_to ON "Transaction"("to");
CREATE INDEX IF NOT EXISTS idx_transaction_value ON "Transaction"("value");
CREATE INDEX IF NOT EXISTS idx_transaction_status ON "Transaction"("status");

-- Índices para la tabla Event
CREATE INDEX IF NOT EXISTS idx_event_address ON "Event"("address");
CREATE INDEX IF NOT EXISTS idx_event_block ON "Event"("blockNumber");
CREATE INDEX IF NOT EXISTS idx_event_transaction ON "Event"("transactionHash");
CREATE INDEX IF NOT EXISTS idx_event_topics ON "Event" USING GIN ("topics");

-- Índices para la tabla Indexer
CREATE INDEX IF NOT EXISTS idx_indexer_status ON "Indexer"("status");
CREATE INDEX IF NOT EXISTS idx_indexer_network ON "Indexer"("network");
CREATE INDEX IF NOT EXISTS idx_indexer_user ON "Indexer"("userId");

-- Índices para la tabla IndexerJob
CREATE INDEX IF NOT EXISTS idx_indexer_job_indexer ON "IndexerJob"("indexerId");
CREATE INDEX IF NOT EXISTS idx_indexer_job_status ON "IndexerJob"("status");
CREATE INDEX IF NOT EXISTS idx_indexer_job_created ON "IndexerJob"("createdAt");

-- Índices para la tabla IndexerConfig
CREATE INDEX IF NOT EXISTS idx_indexer_config_indexer ON "IndexerConfig"("indexerId");
CREATE INDEX IF NOT EXISTS idx_indexer_config_key ON "IndexerConfig"("key");
CREATE UNIQUE INDEX IF NOT EXISTS idx_indexer_config_unique ON "IndexerConfig"("indexerId", "key");

-- Índices compuestos para consultas complejas
CREATE INDEX IF NOT EXISTS idx_block_number_timestamp ON "Block"("number", "timestamp");
CREATE INDEX IF NOT EXISTS idx_transaction_block_status ON "Transaction"("blockNumber", "status");
CREATE INDEX IF NOT EXISTS idx_event_address_block ON "Event"("address", "blockNumber");

-- Estadísticas para el optimizador de consultas
ANALYZE "Block";
ANALYZE "Transaction";
ANALYZE "Event";
ANALYZE "Indexer";
ANALYZE "IndexerJob";
ANALYZE "IndexerConfig";

-- Configuraciones de performance para PostgreSQL
-- (Estas configuraciones deben ajustarse según el hardware disponible)

-- Comentarios sobre configuraciones recomendadas:
-- shared_buffers = 256MB (25% de la RAM disponible)
-- effective_cache_size = 1GB (75% de la RAM disponible)
-- work_mem = 4MB
-- maintenance_work_mem = 64MB
-- checkpoint_completion_target = 0.9
-- wal_buffers = 16MB
-- default_statistics_target = 100
-- random_page_cost = 1.1 (para SSDs)

PRINT 'Índices del indexer creados exitosamente';