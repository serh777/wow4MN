import { PrismaClient } from '@prisma/client';
import { supabase, SupabaseService } from '../src/lib/supabase-client';

// Script para migrar datos de Prisma a Supabase
// IMPORTANTE: Ejecutar este script solo después de haber aplicado el schema SQL en Supabase

const prisma = new PrismaClient();

async function migrateUsers() {
  console.log('Migrando usuarios...');
  
  try {
    const users = await prisma.user.findMany();
    console.log(`Encontrados ${users.length} usuarios`);
    
    for (const user of users) {
      // Los usuarios de Supabase Auth se crean automáticamente
      // Solo necesitamos asegurar que existan en la tabla public.users
      const { data, error } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          email: user.email,
          created_at: user.createdAt.toISOString(),
        })
        .select();
      
      if (error) {
        console.error(`Error migrando usuario ${user.email}:`, error);
      } else {
        console.log(`Usuario ${user.email} migrado exitosamente`);
      }
    }
  } catch (error) {
    console.error('Error migrando usuarios:', error);
  }
}

async function migrateToolData() {
  console.log('Migrando datos de herramientas...');
  
  try {
    const toolData = await prisma.toolData.findMany();
    console.log(`Encontrados ${toolData.length} registros de herramientas`);
    
    for (const data of toolData) {
      const { error } = await supabase
        .from('tool_data')
        .insert({
          id: data.id,
          user_id: data.userId,
          project_name: data.projectName,
          project_url: data.projectUrl,
          tool_id: data.toolId,
          analysis_data: data.analysisData as any,
          status: data.status,
          created_at: data.createdAt.toISOString(),
          updated_at: data.updatedAt.toISOString(),
        });
      
      if (error) {
        console.error(`Error migrando tool data ${data.id}:`, error);
      }
    }
    
    console.log('Datos de herramientas migrados exitosamente');
  } catch (error) {
    console.error('Error migrando datos de herramientas:', error);
  }
}

async function migrateMetadataAnalysis() {
  console.log('Migrando análisis de metadatos...');
  
  try {
    const analyses = await prisma.metadataAnalysis.findMany();
    console.log(`Encontrados ${analyses.length} análisis de metadatos`);
    
    for (const analysis of analyses) {
      const { error } = await supabase
        .from('metadata_analysis')
        .insert({
          id: analysis.id,
          user_id: analysis.userId,
          project_name: analysis.projectName,
          project_url: analysis.projectUrl,
          title: analysis.title,
          description: analysis.description,
          keywords: analysis.keywords,
          og_tags: analysis.ogTags as any,
          twitter_tags: analysis.twitterTags as any,
          schema_markup: analysis.schemaMarkup as any,
          overall_score: analysis.overallScore,
          status: analysis.status,
          created_at: analysis.createdAt.toISOString(),
          updated_at: analysis.updatedAt.toISOString(),
        });
      
      if (error) {
        console.error(`Error migrando metadata analysis ${analysis.id}:`, error);
      }
    }
    
    console.log('Análisis de metadatos migrados exitosamente');
  } catch (error) {
    console.error('Error migrando análisis de metadatos:', error);
  }
}

async function migrateContentAudit() {
  console.log('Migrando auditorías de contenido...');
  
  try {
    const audits = await prisma.contentAudit.findMany();
    console.log(`Encontradas ${audits.length} auditorías de contenido`);
    
    for (const audit of audits) {
      const { error } = await supabase
        .from('content_audit')
        .insert({
          id: audit.id,
          user_id: audit.userId,
          project_name: audit.projectName,
          project_url: audit.projectUrl,
          content_quality: audit.contentQuality as any,
          readability: audit.readability as any,
          structure: audit.structure as any,
          images: audit.images as any,
          links: audit.links as any,
          overall_score: audit.overallScore,
          status: audit.status,
          created_at: audit.createdAt.toISOString(),
          updated_at: audit.updatedAt.toISOString(),
        });
      
      if (error) {
        console.error(`Error migrando content audit ${audit.id}:`, error);
      }
    }
    
    console.log('Auditorías de contenido migradas exitosamente');
  } catch (error) {
    console.error('Error migrando auditorías de contenido:', error);
  }
}

async function migrateKeywordAnalysis() {
  console.log('Migrando análisis de palabras clave...');
  
  try {
    const analyses = await prisma.keywordAnalysis.findMany();
    console.log(`Encontrados ${analyses.length} análisis de palabras clave`);
    
    for (const analysis of analyses) {
      const { error } = await supabase
        .from('keyword_analysis')
        .insert({
          id: analysis.id,
          user_id: analysis.userId,
          project_name: analysis.projectName,
          project_url: analysis.projectUrl,
          primary_keywords: analysis.primaryKeywords,
          secondary_keywords: analysis.secondaryKeywords,
          keyword_density: analysis.keywordDensity as any,
          competitor_keywords: analysis.competitorKeywords as any,
          suggestions: analysis.suggestions as any,
          overall_score: analysis.overallScore,
          status: analysis.status,
          created_at: analysis.createdAt.toISOString(),
          updated_at: analysis.updatedAt.toISOString(),
        });
      
      if (error) {
        console.error(`Error migrando keyword analysis ${analysis.id}:`, error);
      }
    }
    
    console.log('Análisis de palabras clave migrados exitosamente');
  } catch (error) {
    console.error('Error migrando análisis de palabras clave:', error);
  }
}

async function migrateLinkVerification() {
  console.log('Migrando verificaciones de enlaces...');
  
  try {
    const verifications = await prisma.linkVerification.findMany();
    console.log(`Encontradas ${verifications.length} verificaciones de enlaces`);
    
    for (const verification of verifications) {
      const { error } = await supabase
        .from('link_verification')
        .insert({
          id: verification.id,
          user_id: verification.userId,
          project_name: verification.projectName,
          project_url: verification.projectUrl,
          internal_links: verification.internalLinks as any,
          external_links: verification.externalLinks as any,
          broken_links: verification.brokenLinks as any,
          redirect_chains: verification.redirectChains as any,
          anchor_text_analysis: verification.anchorTextAnalysis as any,
          overall_score: verification.overallScore,
          status: verification.status,
          created_at: verification.createdAt.toISOString(),
          updated_at: verification.updatedAt.toISOString(),
        });
      
      if (error) {
        console.error(`Error migrando link verification ${verification.id}:`, error);
      }
    }
    
    console.log('Verificaciones de enlaces migradas exitosamente');
  } catch (error) {
    console.error('Error migrando verificaciones de enlaces:', error);
  }
}

async function migratePerformanceAnalysis() {
  console.log('Migrando análisis de rendimiento...');
  
  try {
    const analyses = await prisma.performanceAnalysis.findMany();
    console.log(`Encontrados ${analyses.length} análisis de rendimiento`);
    
    for (const analysis of analyses) {
      const { error } = await supabase
        .from('performance_analysis')
        .insert({
          id: analysis.id,
          user_id: analysis.userId,
          project_name: analysis.projectName,
          project_url: analysis.projectUrl,
          core_web_vitals: analysis.coreWebVitals as any,
          lighthouse_scores: analysis.lighthouseScores as any,
          page_speed: analysis.pageSpeed as any,
          mobile_performance: analysis.mobilePerformance as any,
          recommendations: analysis.recommendations as any,
          overall_score: analysis.overallScore,
          status: analysis.status,
          created_at: analysis.createdAt.toISOString(),
          updated_at: analysis.updatedAt.toISOString(),
        });
      
      if (error) {
        console.error(`Error migrando performance analysis ${analysis.id}:`, error);
      }
    }
    
    console.log('Análisis de rendimiento migrados exitosamente');
  } catch (error) {
    console.error('Error migrando análisis de rendimiento:', error);
  }
}

async function migrateCompetitionAnalysis() {
  console.log('Migrando análisis de competencia...');
  
  try {
    const analyses = await prisma.competitionAnalysis.findMany();
    console.log(`Encontrados ${analyses.length} análisis de competencia`);
    
    for (const analysis of analyses) {
      const { error } = await supabase
        .from('competition_analysis')
        .insert({
          id: analysis.id,
          user_id: analysis.userId,
          project_name: analysis.projectName,
          project_url: analysis.projectUrl,
          competitors: analysis.competitors as any,
          market_position: analysis.marketPosition as any,
          strengths: analysis.strengths as any,
          weaknesses: analysis.weaknesses as any,
          opportunities: analysis.opportunities as any,
          overall_score: analysis.overallScore,
          status: analysis.status,
          created_at: analysis.createdAt.toISOString(),
          updated_at: analysis.updatedAt.toISOString(),
        });
      
      if (error) {
        console.error(`Error migrando competition analysis ${analysis.id}:`, error);
      }
    }
    
    console.log('Análisis de competencia migrados exitosamente');
  } catch (error) {
    console.error('Error migrando análisis de competencia:', error);
  }
}

async function migrateBlockchainAnalysis() {
  console.log('Migrando análisis blockchain...');
  
  try {
    const analyses = await prisma.blockchainAnalysis.findMany();
    console.log(`Encontrados ${analyses.length} análisis blockchain`);
    
    for (const analysis of analyses) {
      const { error } = await supabase
        .from('blockchain_analysis')
        .insert({
          id: analysis.id,
          user_id: analysis.userId,
          project_name: analysis.projectName,
          project_url: analysis.projectUrl,
          contract_address: analysis.contractAddress,
          network: analysis.network,
          token_metrics: analysis.tokenMetrics as any,
          security_analysis: analysis.securityAnalysis as any,
          liquidity_analysis: analysis.liquidityAnalysis as any,
          holder_analysis: analysis.holderAnalysis as any,
          transaction_analysis: analysis.transactionAnalysis as any,
          overall_score: analysis.overallScore,
          status: analysis.status,
          created_at: analysis.createdAt.toISOString(),
          updated_at: analysis.updatedAt.toISOString(),
        });
      
      if (error) {
        console.error(`Error migrando blockchain analysis ${analysis.id}:`, error);
      }
    }
    
    console.log('Análisis blockchain migrados exitosamente');
  } catch (error) {
    console.error('Error migrando análisis blockchain:', error);
  }
}

async function migrateAIAssistantDashboard() {
  console.log('Migrando dashboards de asistente AI...');
  
  try {
    const dashboards = await prisma.aIAssistantDashboard.findMany();
    console.log(`Encontrados ${dashboards.length} dashboards de asistente AI`);
    
    for (const dashboard of dashboards) {
      const { error } = await supabase
        .from('ai_assistant_dashboard')
        .insert({
          id: dashboard.id,
          user_id: dashboard.userId,
          project_name: dashboard.projectName,
          project_url: dashboard.projectUrl,
          ai_insights: dashboard.aiInsights as any,
          recommendations: dashboard.recommendations as any,
          action_items: dashboard.actionItems as any,
          priority_tasks: dashboard.priorityTasks as any,
          progress_tracking: dashboard.progressTracking as any,
          overall_score: dashboard.overallScore,
          status: dashboard.status,
          created_at: dashboard.createdAt.toISOString(),
          updated_at: dashboard.updatedAt.toISOString(),
        });
      
      if (error) {
        console.error(`Error migrando AI assistant dashboard ${dashboard.id}:`, error);
      }
    }
    
    console.log('Dashboards de asistente AI migrados exitosamente');
  } catch (error) {
    console.error('Error migrando dashboards de asistente AI:', error);
  }
}

async function migrateSocialWeb3Analysis() {
  console.log('Migrando análisis social web3...');
  
  try {
    const analyses = await prisma.socialWeb3Analysis.findMany();
    console.log(`Encontrados ${analyses.length} análisis social web3`);
    
    for (const analysis of analyses) {
      const { error } = await supabase
        .from('social_web3_analysis')
        .insert({
          id: analysis.id,
          user_id: analysis.userId,
          address: analysis.address,
          network: analysis.network,
          platforms: analysis.platforms as any,
          activity: analysis.activity as any,
          followers: analysis.followers as any,
          content: analysis.content as any,
          engagement: analysis.engagement as any,
          influence: analysis.influence as any,
          overall_score: analysis.overallScore,
          status: analysis.status,
          created_at: analysis.createdAt.toISOString(),
          updated_at: analysis.updatedAt.toISOString(),
        });
      
      if (error) {
        console.error(`Error migrando social web3 analysis ${analysis.id}:`, error);
      }
    }
    
    console.log('Análisis social web3 migrados exitosamente');
  } catch (error) {
    console.error('Error migrando análisis social web3:', error);
  }
}

async function migrateIndexers() {
  console.log('Migrando indexers...');
  
  try {
    const indexers = await prisma.indexer.findMany({
      include: {
        jobs: true,
        configs: true,
      },
    });
    console.log(`Encontrados ${indexers.length} indexers`);
    
    for (const indexer of indexers) {
      // Migrar indexer
      const { data: indexerData, error: indexerError } = await supabase
        .from('indexers')
        .insert({
          id: indexer.id,
          name: indexer.name,
          description: indexer.description,
          status: indexer.status,
          last_run: indexer.lastRun?.toISOString(),
          user_id: indexer.userId,
          created_at: indexer.createdAt.toISOString(),
          updated_at: indexer.updatedAt.toISOString(),
        })
        .select()
        .single();
      
      if (indexerError) {
        console.error(`Error migrando indexer ${indexer.id}:`, indexerError);
        continue;
      }
      
      // Migrar jobs del indexer
      for (const job of indexer.jobs) {
        const { error: jobError } = await supabase
          .from('indexer_jobs')
          .insert({
            id: job.id,
            indexer_id: job.indexerId,
            status: job.status,
            started_at: job.startedAt?.toISOString(),
            completed_at: job.completedAt?.toISOString(),
            error: job.error,
            result: job.result as any,
            created_at: job.createdAt.toISOString(),
            updated_at: job.updatedAt.toISOString(),
          });
        
        if (jobError) {
          console.error(`Error migrando indexer job ${job.id}:`, jobError);
        }
      }
      
      // Migrar configs del indexer
      for (const config of indexer.configs) {
        const { error: configError } = await supabase
          .from('indexer_configs')
          .insert({
            id: config.id,
            indexer_id: config.indexerId,
            key: config.key,
            value: config.value,
            created_at: config.createdAt.toISOString(),
            updated_at: config.updatedAt.toISOString(),
          });
        
        if (configError) {
          console.error(`Error migrando indexer config ${config.id}:`, configError);
        }
      }
    }
    
    console.log('Indexers migrados exitosamente');
  } catch (error) {
    console.error('Error migrando indexers:', error);
  }
}

async function migrateBlockchainData() {
  console.log('Migrando datos blockchain...');
  
  try {
    // Migrar bloques
    const blocks = await prisma.block.findMany({
      include: {
        transactions: {
          include: {
            events: true,
          },
        },
      },
    });
    console.log(`Encontrados ${blocks.length} bloques`);
    
    for (const block of blocks) {
      // Migrar bloque
      const { error: blockError } = await supabase
        .from('blocks')
        .insert({
          id: block.id,
          block_number: Number(block.blockNumber),
          block_hash: block.blockHash,
          timestamp: block.timestamp.toISOString(),
          created_at: block.createdAt.toISOString(),
          updated_at: block.updatedAt.toISOString(),
        });
      
      if (blockError) {
        console.error(`Error migrando block ${block.id}:`, blockError);
        continue;
      }
      
      // Migrar transacciones del bloque
      for (const transaction of block.transactions) {
        const { error: txError } = await supabase
          .from('transactions')
          .insert({
            id: transaction.id,
            tx_hash: transaction.txHash,
            block_id: transaction.blockId,
            from_address: transaction.fromAddress,
            to_address: transaction.toAddress,
            value: transaction.value,
            gas_used: Number(transaction.gasUsed),
            gas_price: transaction.gasPrice,
            input: transaction.input,
            status: transaction.status,
            created_at: transaction.createdAt.toISOString(),
            updated_at: transaction.updatedAt.toISOString(),
          });
        
        if (txError) {
          console.error(`Error migrando transaction ${transaction.id}:`, txError);
          continue;
        }
        
        // Migrar eventos de la transacción
        for (const event of transaction.events) {
          const { error: eventError } = await supabase
            .from('events')
            .insert({
              id: event.id,
              transaction_id: event.transactionId,
              address: event.address,
              event_name: event.eventName,
              topics: event.topics,
              data: event.data,
              log_index: Number(event.logIndex),
              created_at: event.createdAt.toISOString(),
              updated_at: event.updatedAt.toISOString(),
            });
          
          if (eventError) {
            console.error(`Error migrando event ${event.id}:`, eventError);
          }
        }
      }
    }
    
    console.log('Datos blockchain migrados exitosamente');
  } catch (error) {
    console.error('Error migrando datos blockchain:', error);
  }
}

async function migrateToolPayments() {
  console.log('Migrando pagos de herramientas...');
  
  try {
    const payments = await prisma.toolPayment.findMany();
    console.log(`Encontrados ${payments.length} pagos de herramientas`);
    
    for (const payment of payments) {
      const { error } = await supabase
        .from('tool_payments')
        .insert({
          id: payment.id,
          user_id: payment.userId,
          tool_id: payment.toolId,
          tool_name: payment.toolName,
          amount: payment.amount,
          token_address: payment.tokenAddress,
          token_symbol: payment.tokenSymbol,
          tx_hash: payment.txHash,
          block_number: payment.blockNumber ? Number(payment.blockNumber) : null,
          network: payment.network,
          status: payment.status,
          plan_id: payment.planId,
          discount: payment.discount,
          created_at: payment.createdAt.toISOString(),
          updated_at: payment.updatedAt.toISOString(),
        });
      
      if (error) {
        console.error(`Error migrando tool payment ${payment.id}:`, error);
      }
    }
    
    console.log('Pagos de herramientas migrados exitosamente');
  } catch (error) {
    console.error('Error migrando pagos de herramientas:', error);
  }
}

async function migrateUserSettings() {
  console.log('Migrando configuraciones de usuario...');
  
  try {
    const settings = await prisma.userSettings.findMany();
    console.log(`Encontradas ${settings.length} configuraciones de usuario`);
    
    for (const setting of settings) {
      const { error } = await supabase
        .from('user_settings')
        .insert({
          id: setting.id,
          user_id: setting.userId,
          preferred_network: setting.preferredNetwork,
          preferred_token: setting.preferredToken,
          notifications: setting.notifications as any,
          theme: setting.theme,
          language: setting.language,
          timezone: setting.timezone,
          created_at: setting.createdAt.toISOString(),
          updated_at: setting.updatedAt.toISOString(),
        });
      
      if (error) {
        console.error(`Error migrando user settings ${setting.id}:`, error);
      }
    }
    
    console.log('Configuraciones de usuario migradas exitosamente');
  } catch (error) {
    console.error('Error migrando configuraciones de usuario:', error);
  }
}

async function migrateToolActionHistory() {
  console.log('Migrando historial de acciones...');
  
  try {
    const history = await prisma.toolActionHistory.findMany();
    console.log(`Encontrados ${history.length} registros de historial`);
    
    for (const action of history) {
      const { error } = await supabase
        .from('tool_action_history')
        .insert({
          id: action.id,
          user_id: action.userId,
          tool_id: action.toolId,
          tool_name: action.toolName,
          action: action.action,
          description: action.description,
          resource_id: action.resourceId,
          metadata: action.metadata as any,
          tx_hash: action.txHash,
          network: action.network,
          created_at: action.createdAt.toISOString(),
        });
      
      if (error) {
        console.error(`Error migrando tool action history ${action.id}:`, error);
      }
    }
    
    console.log('Historial de acciones migrado exitosamente');
  } catch (error) {
    console.error('Error migrando historial de acciones:', error);
  }
}

async function migrateAnalysisSummary() {
  console.log('Migrando resúmenes de análisis...');
  
  try {
    const summaries = await prisma.analysisSummary.findMany();
    console.log(`Encontrados ${summaries.length} resúmenes de análisis`);
    
    for (const summary of summaries) {
      const { error } = await supabase
        .from('analysis_summary')
        .insert({
          id: summary.id,
          user_id: summary.userId,
          project_name: summary.projectName,
          project_url: summary.projectUrl,
          total_analyses: summary.totalAnalyses,
          average_score: summary.averageScore,
          last_analysis: summary.lastAnalysis?.toISOString(),
          tools_used: summary.toolsUsed as any,
          improvements: summary.improvements as any,
          status: summary.status,
          created_at: summary.createdAt.toISOString(),
          updated_at: summary.updatedAt.toISOString(),
        });
      
      if (error) {
        console.error(`Error migrando analysis summary ${summary.id}:`, error);
      }
    }
    
    console.log('Resúmenes de análisis migrados exitosamente');
  } catch (error) {
    console.error('Error migrando resúmenes de análisis:', error);
  }
}

async function main() {
  console.log('Iniciando migración de datos de Prisma a Supabase...');
  console.log('IMPORTANTE: Asegúrate de haber ejecutado el script SQL en Supabase primero.');
  
  try {
    await migrateUsers();
    await migrateToolData();
    await migrateMetadataAnalysis();
    await migrateContentAudit();
    await migrateKeywordAnalysis();
    await migrateLinkVerification();
    await migratePerformanceAnalysis();
    await migrateCompetitionAnalysis();
    await migrateBlockchainAnalysis();
    await migrateAIAssistantDashboard();
    await migrateSocialWeb3Analysis();
    await migrateIndexers();
    await migrateBlockchainData();
    await migrateToolPayments();
    await migrateUserSettings();
    await migrateToolActionHistory();
    await migrateAnalysisSummary();
    
    console.log('\n✅ Migración completada exitosamente!');
    console.log('\nPróximos pasos:');
    console.log('1. Verificar que todos los datos se migraron correctamente');
    console.log('2. Actualizar las referencias de Prisma en el código');
    console.log('3. Probar la aplicación con Supabase');
    console.log('4. Eliminar Prisma cuando todo funcione correctamente');
    
  } catch (error) {
    console.error('Error durante la migración:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar solo si se llama directamente
if (require.main === module) {
  main();
}

export { main as migrateData };