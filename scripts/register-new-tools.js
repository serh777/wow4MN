const { ethers } = require("hardhat");

// Dirección del contrato desplegado (actualizar con la dirección real)
const CONTRACT_ADDRESS = "TU_DIRECCION_DEL_CONTRATO_AQUI";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Registrando nuevas herramientas con la cuenta:", deployer.address);

  // Conectar al contrato existente
  const DashboardToolsContract = await ethers.getContractFactory("DashboardToolsContract");
  const dashboardContract = DashboardToolsContract.attach(CONTRACT_ADDRESS);
  
  console.log("Conectado al contrato en:", CONTRACT_ADDRESS);
  
  // Definir los IDs de las nuevas herramientas
  const NEW_TOOL_IDS = {
    BACKLINKS_ANALYSIS: ethers.utils.keccak256(ethers.utils.toUtf8Bytes("BACKLINKS_ANALYSIS")),
    SECURITY_AUDIT: ethers.utils.keccak256(ethers.utils.toUtf8Bytes("SECURITY_AUDIT")),
    WALLET_ANALYSIS: ethers.utils.keccak256(ethers.utils.toUtf8Bytes("WALLET_ANALYSIS"))
  };
  
  console.log("\nIDs de las nuevas herramientas:");
  console.log("BACKLINKS_ANALYSIS:", NEW_TOOL_IDS.BACKLINKS_ANALYSIS);
  console.log("SECURITY_AUDIT:", NEW_TOOL_IDS.SECURITY_AUDIT);
  console.log("WALLET_ANALYSIS:", NEW_TOOL_IDS.WALLET_ANALYSIS);
  
  try {
    // Registrar las nuevas herramientas con precio de 5 USDC cada una
    console.log("\nRegistrando BACKLINKS_ANALYSIS...");
    const tx1 = await dashboardContract.setToolPrice(
      NEW_TOOL_IDS.BACKLINKS_ANALYSIS, 
      ethers.utils.parseUnits("5", 6) // 5 USDC (6 decimales)
    );
    await tx1.wait();
    console.log("✅ BACKLINKS_ANALYSIS registrada. Hash:", tx1.hash);
    
    console.log("\nRegistrando SECURITY_AUDIT...");
    const tx2 = await dashboardContract.setToolPrice(
      NEW_TOOL_IDS.SECURITY_AUDIT, 
      ethers.utils.parseUnits("5", 6) // 5 USDC (6 decimales)
    );
    await tx2.wait();
    console.log("✅ SECURITY_AUDIT registrada. Hash:", tx2.hash);
    
    console.log("\nRegistrando WALLET_ANALYSIS...");
    const tx3 = await dashboardContract.setToolPrice(
      NEW_TOOL_IDS.WALLET_ANALYSIS, 
      ethers.utils.parseUnits("5", 6) // 5 USDC (6 decimales)
    );
    await tx3.wait();
    console.log("✅ WALLET_ANALYSIS registrada. Hash:", tx3.hash);
    
    console.log("\n🎉 Todas las nuevas herramientas han sido registradas exitosamente!");
    
    // Verificar el número total de herramientas registradas
    const registeredToolIds = await dashboardContract.registeredToolIds();
    console.log("\n📊 Total de herramientas registradas:", registeredToolIds.length);
    
  } catch (error) {
    console.error("❌ Error al registrar las herramientas:", error.message);
    
    // Verificar si el usuario tiene permisos
    const PRICE_ADMIN_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("PRICE_ADMIN_ROLE"));
    const hasRole = await dashboardContract.hasRole(PRICE_ADMIN_ROLE, deployer.address);
    
    if (!hasRole) {
      console.log("\n⚠️  El usuario no tiene el rol PRICE_ADMIN_ROLE necesario.");
      console.log("Solicita al administrador del contrato que te otorgue este rol o que registre las herramientas.");
    }
  }
}

// Función para verificar herramientas registradas
async function verifyTools() {
  const [deployer] = await ethers.getSigners();
  const DashboardToolsContract = await ethers.getContractFactory("DashboardToolsContract");
  const dashboardContract = DashboardToolsContract.attach(CONTRACT_ADDRESS);
  
  console.log("\n🔍 Verificando herramientas registradas...");
  
  const toolNames = [
    "METADATA_ANALYSIS", "CONTENT_AUDIT", "KEYWORD_ANALYSIS", 
    "LINK_VERIFICATION", "PERFORMANCE_ANALYSIS", "BLOCKCHAIN_ANALYSIS", 
    "AI_ASSISTANT_DASHBOARD", "SOCIAL_WEB3_ANALYSIS",
    "BACKLINKS_ANALYSIS", "SECURITY_AUDIT", "WALLET_ANALYSIS"
  ];
  
  for (const toolName of toolNames) {
    const toolId = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(toolName));
    const price = await dashboardContract.toolPrices(toolId);
    const isRegistered = await dashboardContract.isToolRegistered(toolId);
    
    console.log(`${toolName}: ${isRegistered ? '✅' : '❌'} Precio: ${ethers.utils.formatUnits(price, 6)} USDC`);
  }
}

// Ejecutar el script
if (require.main === module) {
  main()
    .then(() => {
      console.log("\n🔍 Ejecutando verificación...");
      return verifyTools();
    })
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { main, verifyTools };