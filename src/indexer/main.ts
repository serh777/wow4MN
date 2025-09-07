import { getIndexer } from './indexer';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

console.log('Iniciando el indexador...');

// Función principal
async function main() {
  try {
    const indexer = getIndexer();
    
    if (!indexer) {
      console.error('No se pudo inicializar el indexer');
      return;
    }
    
    // Aquí podríamos agregar lógica para determinar qué indexador ejecutar
    // Por ahora, simplemente mostramos un mensaje
    console.log('Indexador iniciado correctamente');
    console.log('Configuración cargada con RPC URL:', process.env.ETHEREUM_RPC_URL ? 'Configurado' : 'No configurado');
    
    // Si tuviéramos un ID de indexador específico, podríamos iniciarlo así:
    // await indexer.startIndexer('id-del-indexador');
    
  } catch (error) {
    console.error('Error al ejecutar el indexador:', error);
  }
}

// Ejecutar la función principal
main().catch(error => {
  console.error('Error fatal en el indexador:', error);
  process.exit(1);
});