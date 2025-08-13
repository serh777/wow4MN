// Configuración para la extensión de Supabase en Netlify
// Basado en: https://app.netlify.com/extensions/supabase

exports.handler = async (event, context) => {
  // Configuración de variables de entorno para Supabase
  const supabaseConfig = {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY, // Solo para funciones del servidor
  };

  // Verificar que las variables estén configuradas
  if (!supabaseConfig.url || !supabaseConfig.anonKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Supabase configuration missing',
        details: {
          hasUrl: !!supabaseConfig.url,
          hasAnonKey: !!supabaseConfig.anonKey,
        }
      })
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Supabase configuration loaded successfully',
      config: {
        url: supabaseConfig.url,
        hasAnonKey: !!supabaseConfig.anonKey,
        hasServiceRoleKey: !!supabaseConfig.serviceRoleKey,
      }
    })
  };
};