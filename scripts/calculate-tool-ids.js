const crypto = require('crypto');

/**
 * Script para calcular los IDs (keccak256) de las herramientas
 * Estos IDs son necesarios para llamar setToolPrice()
 */

// Función para calcular keccak256 como lo hace ethers
function keccak256(text) {
  return '0x' + crypto.createHash('sha3-256').update(text, 'utf8').digest('hex');
}

// Función para formatear unidades (simula ethers.utils.parseUnits)
function parseUnits(value, decimals) {
  const factor = Math.pow(10, decimals);
  return (parseFloat(value) * factor).toString();
}

function calculateToolIds() {
  console.log("🔧 Calculando IDs de herramientas (keccak256)\n");
  
  // Herramientas existentes (ya registradas)
  const existingTools = [
    "METADATA_ANALYSIS",
    "CONTENT_AUDIT", 
    "KEYWORD_ANALYSIS",
    "LINK_VERIFICATION",
    "PERFORMANCE_ANALYSIS",
    "BLOCKCHAIN_ANALYSIS",
    "AI_ASSISTANT_DASHBOARD",
    "SOCIAL_WEB3_ANALYSIS"
  ];
  
  // Nuevas herramientas a registrar
  const newTools = [
    "BACKLINKS_ANALYSIS",
    "SECURITY_AUDIT", 
    "WALLET_ANALYSIS"
  ];
  
  console.log("📋 HERRAMIENTAS EXISTENTES (ya registradas):");
  existingTools.forEach(tool => {
    const id = keccak256(tool);
    console.log(`${tool}: ${id}`);
  });
  
  console.log("\n🆕 NUEVAS HERRAMIENTAS (a registrar):");
  newTools.forEach(tool => {
    const id = keccak256(tool);
    console.log(`${tool}: ${id}`);
  });
  
  console.log("\n💰 PRECIOS EN DIFERENTES FORMATOS:");
  console.log("5 USDC (6 decimales):", parseUnits("5", 6));
  console.log("7 USDC (6 decimales):", parseUnits("7", 6));
  
  console.log("\n📝 COMANDOS PARA REGISTRAR (usando ethers.js):");
  newTools.forEach(tool => {
    const id = keccak256(tool);
    const price = parseUnits("5", 6);
    console.log(`await contract.setToolPrice("${id}", "${price}"); // ${tool}`);
  });
  
  console.log("\n🔍 COMANDOS PARA VERIFICAR:");
  newTools.forEach(tool => {
    const id = keccak256(tool);
    console.log(`await contract.isToolRegistered("${id}"); // ${tool}`);
    console.log(`await contract.toolPrices("${id}"); // Precio de ${tool}`);
  });
  
  return {
    existingTools: existingTools.map(tool => ({
      name: tool,
      id: keccak256(tool)
    })),
    newTools: newTools.map(tool => ({
      name: tool,
      id: keccak256(tool)
    }))
  };
}

// Función para generar código JavaScript listo para usar
function generateRegistrationCode() {
  console.log("\n\n🚀 CÓDIGO JAVASCRIPT LISTO PARA COPIAR Y PEGAR:\n");
  
  const code = `
// Conectar al contrato (ajusta la dirección y ABI)
const contractAddress = "TU_DIRECCION_DEL_CONTRATO";
const contract = new ethers.Contract(contractAddress, abi, signer);

// IDs de las nuevas herramientas
const BACKLINKS_ANALYSIS = "${keccak256("BACKLINKS_ANALYSIS")}";
const SECURITY_AUDIT = "${keccak256("SECURITY_AUDIT")}";
const WALLET_ANALYSIS = "${keccak256("WALLET_ANALYSIS")}";

// Precio: 5 USDC (6 decimales)
const price = "${parseUnits("5", 6)}";

// Registrar las herramientas
async function registerNewTools() {
  try {
    console.log("Registrando BACKLINKS_ANALYSIS...");
    await contract.setToolPrice(BACKLINKS_ANALYSIS, price);
    
    console.log("Registrando SECURITY_AUDIT...");
    await contract.setToolPrice(SECURITY_AUDIT, price);
    
    console.log("Registrando WALLET_ANALYSIS...");
    await contract.setToolPrice(WALLET_ANALYSIS, price);
    
    console.log("✅ Todas las herramientas registradas!");
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

// Ejecutar
registerNewTools();
`;
  
  console.log(code);
}

if (require.main === module) {
  const result = calculateToolIds();
  generateRegistrationCode();
  
  console.log("\n\n📊 RESUMEN:");
  console.log(`Total herramientas existentes: ${result.existingTools.length}`);
  console.log(`Nuevas herramientas a registrar: ${result.newTools.length}`);
  console.log(`Total después del registro: ${result.existingTools.length + result.newTools.length}`);
}

module.exports = { calculateToolIds, generateRegistrationCode };