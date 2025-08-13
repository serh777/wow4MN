import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/services/database-service';
import { Database } from '@/lib/database.types';
import { z } from 'zod';

const databaseService = new DatabaseService();



// Schema de validación para crear verificación de enlaces
const createLinkVerificationSchema = z.object({
  userId: z.string().min(1, 'User ID es requerido'),
  projectName: z.string().min(1, 'Nombre del proyecto es requerido'),
  projectUrl: z.string().url('URL del proyecto debe ser válida'),
  totalLinks: z.number().int().min(0),
  workingLinks: z.number().int().min(0),
  brokenLinks: z.number().int().min(0),
  redirectLinks: z.number().int().min(0),
  internalLinks: z.number().int().min(0),
  externalLinks: z.number().int().min(0),
  nofollowLinks: z.number().int().min(0),
  dofollowLinks: z.number().int().min(0),
  linkHealth: z.number().min(0).max(100),
  authorityScore: z.number().min(0).max(100),
  trustScore: z.number().min(0).max(100),
  spamScore: z.number().min(0).max(100),
  brokenLinksList: z.array(z.string()).optional(),
  redirectLinksList: z.array(z.string()).optional(),
  recommendations: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional()
});

// Schema para actualizar verificación
const updateLinkVerificationSchema = createLinkVerificationSchema.partial().extend({
  id: z.string().min(1, 'ID es requerido')
});

// GET - Obtener verificaciones de enlaces
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const id = searchParams.get('id');
    const projectUrl = searchParams.get('projectUrl');
    const hasIssues = searchParams.get('hasIssues'); // 'true' para mostrar solo con enlaces rotos
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    if (id) {
      // Obtener análisis específico por ID
      const analysis = await databaseService.getLinkVerificationById(id);
      if (!analysis) {
        return NextResponse.json(
          { error: 'Análisis no encontrado' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: analysis });
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID es requerido' },
        { status: 400 }
      );
    }

    // Construir filtros
    const filters: any = {};
    if (projectUrl) filters.projectUrl = projectUrl;
    if (hasIssues === 'true') {
      filters.brokenLinks = {
        gt: 0 // Mayor que 0
      };
    }

    // Obtener análisis por usuario
    const analyses = await databaseService.getLinkVerificationsByUser(userId);

    // Calcular estadísticas agregadas
    const stats = {
      totalVerifications: analyses.length,
      totalLinksChecked: analyses.reduce((sum, v) => {
        const internal = (v.internal_links as any)?.total || 0;
        const external = (v.external_links as any)?.total || 0;
        return sum + internal + external;
      }, 0),
      totalBrokenLinks: analyses.reduce((sum, v) => {
        const internalBroken = (v.internal_links as any)?.broken || 0;
        const externalBroken = (v.external_links as any)?.broken || 0;
        return sum + internalBroken + externalBroken;
      }, 0),
      averageLinkHealth: analyses.length > 0
        ? analyses.reduce((sum, v) => sum + (v.overall_score || 0), 0) / analyses.length
        : 0,
      sitesWithIssues: analyses.filter((v: any) => {
        const internalBroken = (v.internal_links as any)?.broken || 0;
        const externalBroken = (v.external_links as any)?.broken || 0;
        return internalBroken > 0 || externalBroken > 0;
      }).length
    };

    return NextResponse.json({ 
      success: true, 
      data: analyses,
      stats
    });

  } catch (error) {
    console.error('Error al obtener verificaciones de enlaces:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST - Crear nueva verificación de enlaces
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar entrada
    const validatedData = createLinkVerificationSchema.parse(body);

    // Validar consistencia de datos
    if (validatedData.workingLinks + validatedData.brokenLinks + validatedData.redirectLinks !== validatedData.totalLinks) {
      return NextResponse.json(
        { error: 'La suma de enlaces trabajando, rotos y redirigidos debe igual al total' },
        { status: 400 }
      );
    }

    if (validatedData.internalLinks + validatedData.externalLinks !== validatedData.totalLinks) {
      return NextResponse.json(
        { error: 'La suma de enlaces internos y externos debe igual al total' },
        { status: 400 }
      );
    }

    // Calcular score general
    const overallScore = Math.round((validatedData.linkHealth + validatedData.authorityScore + validatedData.trustScore + (100 - validatedData.spamScore)) / 4);

    // Transformar datos para coincidir con el esquema de la base de datos
    const analysisData: Database['public']['Tables']['link_verification']['Insert'] = {
      user_id: validatedData.userId,
      project_name: validatedData.projectName,
      project_url: validatedData.projectUrl,
      internal_links: {
        total: validatedData.internalLinks,
        working: validatedData.internalLinks - (validatedData.brokenLinks || 0),
        broken: validatedData.brokenLinks || 0,
        redirects: validatedData.redirectLinks || 0
      },
      external_links: {
        total: validatedData.externalLinks,
        working: validatedData.externalLinks - (validatedData.brokenLinks || 0),
        broken: 0,
        nofollow: validatedData.nofollowLinks || 0
      },
      broken_links: {
        total: validatedData.brokenLinks || 0,
        list: validatedData.brokenLinksList || [],
        types: []
      },
      redirect_chains: {
        total: validatedData.redirectLinks || 0,
        chains: []
      },
      anchor_text_analysis: {
        distribution: {},
        recommendations: validatedData.recommendations || []
      },
      overall_score: overallScore,
      status: 'completed'
    };

    // Crear análisis
    const analysis = await databaseService.createLinkVerification(analysisData);

    // Registrar acción
    await databaseService.createToolActionHistory({
      user_id: validatedData.userId,
      tool_name: 'Link Verification',
      description: `Link verification completed for project ${validatedData.projectName}`,
      resource_id: analysis.id,
      network: null,
      tx_hash: null,
      tool_id: 'LINK_VERIFICATION',
      action: 'analysis_completed',
      metadata: {
        projectUrl: validatedData.projectUrl,
        projectName: validatedData.projectName,
        analysisId: analysis.id,
        overallScore
      }
    });

    // Actualizar resumen
    await databaseService.createOrUpdateAnalysisSummary(validatedData.userId, {
      user_id: validatedData.userId,
      project_name: validatedData.projectName,
      project_url: validatedData.projectUrl,
      tools_used: ['LINK_VERIFICATION'],
      average_score: overallScore,
      total_analyses: 1,
      last_analysis: new Date().toISOString(),
      status: 'completed',
      improvements: null
    });

    return NextResponse.json({
      success: true,
      data: analysis,
      message: 'Verificación de enlaces creada exitosamente'
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Datos inválidos',
          details: error.errors
        },
        { status: 400 }
      );
    }

    console.error('Error al crear verificación de enlaces:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar verificación de enlaces
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar entrada
    const validatedData = updateLinkVerificationSchema.parse(body);
    const { id, ...updateData } = validatedData;

    // Verificar que la verificación existe
    const existingVerification = await databaseService.getLinkVerificationById(id);
    if (!existingVerification) {
      return NextResponse.json(
        { error: 'Verificación no encontrada' },
        { status: 404 }
      );
    }

    // Transformar updateData para coincidir con el esquema de la base de datos
    const transformedUpdateData: Partial<Database['public']['Tables']['link_verification']['Update']> = {};

    // Mapear campos directos
    if (updateData.userId) transformedUpdateData.user_id = updateData.userId;
    if (updateData.projectName) transformedUpdateData.project_name = updateData.projectName;
    if (updateData.projectUrl) transformedUpdateData.project_url = updateData.projectUrl;

    // Mapear internal_links (objeto JSON)
    if (updateData.internalLinks !== undefined || updateData.brokenLinks !== undefined || updateData.redirectLinks !== undefined) {
      const existingInternal = (existingVerification.internal_links as any) || {};
      transformedUpdateData.internal_links = {
        ...existingInternal,
        ...(updateData.internalLinks !== undefined && { 
          total: updateData.internalLinks,
          working: updateData.internalLinks - (updateData.brokenLinks || 0)
        }),
        ...(updateData.brokenLinks !== undefined && { broken: updateData.brokenLinks }),
        ...(updateData.redirectLinks !== undefined && { redirects: updateData.redirectLinks })
      };
    }

    // Mapear external_links (objeto JSON)
    if (updateData.externalLinks !== undefined || updateData.nofollowLinks !== undefined) {
      const existingExternal = (existingVerification.external_links as any) || {};
      transformedUpdateData.external_links = {
        ...existingExternal,
        ...(updateData.externalLinks !== undefined && { 
          total: updateData.externalLinks,
          working: updateData.externalLinks
        }),
        ...(updateData.nofollowLinks !== undefined && { nofollow: updateData.nofollowLinks })
      };
    }

    // Mapear broken_links (objeto JSON)
    if (updateData.brokenLinks !== undefined || updateData.brokenLinksList) {
      const existingBroken = (existingVerification.broken_links as any) || {};
      transformedUpdateData.broken_links = {
        ...existingBroken,
        ...(updateData.brokenLinks !== undefined && { total: updateData.brokenLinks }),
        ...(updateData.brokenLinksList && { list: updateData.brokenLinksList })
      };
    }

    // Mapear redirect_chains (objeto JSON)
    if (updateData.redirectLinks !== undefined || updateData.redirectLinksList) {
      const existingRedirect = (existingVerification.redirect_chains as any) || {};
      transformedUpdateData.redirect_chains = {
        ...existingRedirect,
        ...(updateData.redirectLinks !== undefined && { total: updateData.redirectLinks }),
        ...(updateData.redirectLinksList && { chains: updateData.redirectLinksList })
      };
    }

    // Mapear anchor_text_analysis (objeto JSON)
    if (updateData.recommendations) {
      const existingAnchor = (existingVerification.anchor_text_analysis as any) || {};
      transformedUpdateData.anchor_text_analysis = {
        ...existingAnchor,
        recommendations: updateData.recommendations
      };
    }

    // Recalcular overall_score si hay cambios relevantes
    if (updateData.linkHealth !== undefined || updateData.authorityScore !== undefined || 
        updateData.trustScore !== undefined || updateData.spamScore !== undefined) {
      const linkHealth = updateData.linkHealth ?? 80; // default
      const authorityScore = updateData.authorityScore ?? 70; // default
      const trustScore = updateData.trustScore ?? 75; // default
      const spamScore = updateData.spamScore ?? 10; // default
      
      transformedUpdateData.overall_score = Math.round((linkHealth + authorityScore + trustScore + (100 - spamScore)) / 4);
    }

    // Actualizar verificación
    const updatedVerification = await databaseService.updateLinkVerification(id, transformedUpdateData);

    return NextResponse.json({
      success: true,
      data: updatedVerification,
      message: 'Verificación de enlaces actualizada exitosamente'
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Datos inválidos',
          details: error.errors
        },
        { status: 400 }
      );
    }

    console.error('Error al actualizar verificación de enlaces:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar verificación de enlaces
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID es requerido' },
        { status: 400 }
      );
    }

    // Verificar que la verificación existe
    const existingVerification = await databaseService.getLinkVerificationById(id);
    if (!existingVerification) {
      return NextResponse.json(
        { error: 'Verificación no encontrada' },
        { status: 404 }
      );
    }

    // Eliminar verificación
    await databaseService.deleteLinkVerification(id);

    return NextResponse.json({
      success: true,
      message: 'Verificación de enlaces eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar verificación de enlaces:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}