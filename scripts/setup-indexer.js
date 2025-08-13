#!/usr/bin/env node

const { PrismaClient } = require('../src/generated/prisma');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function setupIndexerDatabase() {
  console.log('🚀 Configurando base de datos para el Indexer...');
  
  try {
    // Verificar conexión a la base de datos
    console.log('📡 Verificando conexión a la base de datos...');
    await prisma.$connect();
    console.log('✅ Conexión establecida');

    // Leer y ejecutar el script SQL
    const sqlPath = path.join(__dirname, 'setup-indexer-db.sql');
    
    if (!fs.existsSync(sqlPath)) {
      throw new Error(`Archivo SQL no encontrado: ${sqlPath}`);
    }

    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Dividir el contenido en comandos individuales
    const commands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--') && !cmd.startsWith('PRINT'));

    console.log('📊 Creando índices de base de datos...');
    
    for (const command of commands) {
      if (command.trim()) {
        try {
          await prisma.$executeRawUnsafe(command);
          console.log(`✅ Ejecutado: ${command.substring(0, 50)}...`);
        } catch (error) {
          // Ignorar errores de índices que ya existen
          if (error.message.includes('already exists')) {
            console.log(`⚠️  Índice ya existe: ${command.substring(0, 50)}...`);
          } else {
            console.error(`❌ Error ejecutando: ${command.substring(0, 50)}...`);
            console.error(error.message);
          }
        }
      }
    }

    // Crear configuración inicial del indexer si no existe
    console.log('⚙️  Configurando indexers iniciales...');
    
    const existingIndexers = await prisma.indexer.count();
    
    if (existingIndexers === 0) {
      // Crear o encontrar usuario del sistema
      let systemUser = await prisma.user.findUnique({
        where: { email: 'system@wowseoweb3.com' }
      });
      
      if (!systemUser) {
        systemUser = await prisma.user.create({
          data: {
            id: 'system',
            email: 'srhskl@proton.me'
          }
        });
      }
      
      // Crear indexer de ejemplo para Ethereum Mainnet
      const defaultIndexer = await prisma.indexer.create({
        data: {
          name: 'Ethereum Mainnet Indexer',
          description: 'Indexer principal para Ethereum Mainnet',
          status: 'inactive',
          userId: systemUser.id,
          configs: {
            create: [
              {
                key: 'network',
                value: 'ethereum'
              },
              {
                key: 'startBlock',
                value: '18000000'
              },
              {
                key: 'batchSize',
                value: '10'
              },
              {
                key: 'concurrency',
                value: '1'
              },
              {
                key: 'lastProcessedBlock',
                value: '18000000'
              }
            ]
          }
        }
      });
      
      console.log(`✅ Indexer creado: ${defaultIndexer.id}`);
    } else {
      console.log(`ℹ️  Ya existen ${existingIndexers} indexers configurados`);
    }

    // Verificar configuración
    console.log('🔍 Verificando configuración...');
    
    const indexerCount = await prisma.indexer.count();
    const configCount = await prisma.indexerConfig.count();
    
    console.log(`📈 Estadísticas:`);
    console.log(`   - Indexers: ${indexerCount}`);
    console.log(`   - Configuraciones: ${configCount}`);
    
    // Verificar índices creados
    const indexInfo = await prisma.$queryRaw`
      SELECT 
        schemaname,
        tablename,
        indexname,
        indexdef
      FROM pg_indexes 
      WHERE tablename IN ('Block', 'Transaction', 'Event', 'Indexer', 'IndexerJob', 'IndexerConfig')
      AND indexname LIKE 'idx_%'
      ORDER BY tablename, indexname;
    `;
    
    console.log(`🗂️  Índices creados: ${indexInfo.length}`);
    
    console.log('🎉 Configuración del Indexer completada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error configurando el Indexer:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

async function checkEnvironment() {
  console.log('🔧 Verificando variables de entorno...');
  
  const requiredEnvVars = [
    'DATABASE_URL',
  ];
  
  const optionalEnvVars = [
    'INFURA_PROJECT_ID',
    'ALCHEMY_API_KEY',
    'ETHERSCAN_API_KEY'
  ];
  
  let missingRequired = [];
  let missingOptional = [];
  
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missingRequired.push(envVar);
    } else {
      console.log(`✅ ${envVar}: configurado`);
    }
  }
  
  for (const envVar of optionalEnvVars) {
    if (!process.env[envVar]) {
      missingOptional.push(envVar);
    } else {
      console.log(`✅ ${envVar}: configurado`);
    }
  }
  
  if (missingRequired.length > 0) {
    console.error('❌ Variables de entorno requeridas faltantes:');
    missingRequired.forEach(envVar => console.error(`   - ${envVar}`));
    process.exit(1);
  }
  
  if (missingOptional.length > 0) {
    console.warn('⚠️  Variables de entorno opcionales faltantes:');
    missingOptional.forEach(envVar => console.warn(`   - ${envVar}`));
    console.warn('   El indexer funcionará con proveedores públicos (limitaciones de rate)');
  }
}

async function main() {
  console.log('🔧 WowSEOWeb3 - Configuración del Indexer');
  console.log('==========================================\n');
  
  await checkEnvironment();
  await setupIndexerDatabase();
  
  console.log('\n✨ ¡Configuración completada! El indexer está listo para usar.');
  console.log('\n📖 Próximos pasos:');
  console.log('   1. Ejecutar: npm run dev');
  console.log('   2. Navegar a: /dashboard/indexers');
  console.log('   3. Iniciar un indexer desde la interfaz');
  console.log('\n🔗 Documentación: /src/indexer/best-practices.md');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { setupIndexerDatabase, checkEnvironment };