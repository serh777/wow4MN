const fs = require('fs');
const path = require('path');

// Ruta al archivo compilado
const artifactPath = path.join(__dirname, '../src/artifacts/src/contracts/contracts/DashboardToolsContract.sol/DashboardToolsContract.json');

// Ruta donde guardar el ABI
const outputPath = path.join(__dirname, '../src/config/contract-abi.json');

try {
  // Leer el archivo de artefactos
  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
  
  // Extraer solo el ABI
  const abi = artifact.abi;
  
  // Guardar el ABI
  fs.writeFileSync(outputPath, JSON.stringify(abi, null, 2));
  
  console.log('✅ ABI extraído exitosamente a:', outputPath);
  console.log('📝 Funciones encontradas:', abi.filter(item => item.type === 'function').length);
  console.log('📡 Eventos encontrados:', abi.filter(item => item.type === 'event').length);
} catch (error) {
  console.error('❌ Error al extraer ABI:', error.message);
}