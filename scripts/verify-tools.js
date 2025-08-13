const { ethers } = require("hardhat");

async function main() {
  // Dirección del contrato desplegado
  const contractAddress = "TU_DIRECCIÓN_DE_CONTRATO_DESPLEGADO";
  
  const dashboardContract = await ethers.getContractAt("DashboardToolsContract", contractAddress);
  
  // Verificar herramientas registradas (11 herramientas)
  const TOOL_IDS = {
    METADATA_ANALYSIS: ethers.utils.keccak256(ethers.utils.toUtf8Bytes("METADATA_ANALYSIS")),
    CONTENT_AUDIT: ethers.utils.keccak256(ethers.utils.toUtf8Bytes("CONTENT_AUDIT")),
    KEYWORD_ANALYSIS: ethers.utils.keccak256(ethers.utils.toUtf8Bytes("KEYWORD_ANALYSIS")),
    LINK_VERIFICATION: ethers.utils.keccak256(ethers.utils.toUtf8Bytes("LINK_VERIFICATION")),
    PERFORMANCE_ANALYSIS: ethers.utils.keccak256(ethers.utils.toUtf8Bytes("PERFORMANCE_ANALYSIS")),
    BACKLINKS_ANALYSIS: ethers.utils.keccak256(ethers.utils.toUtf8Bytes("BACKLINKS_ANALYSIS")),
    SECURITY_AUDIT: ethers.utils.keccak256(ethers.utils.toUtf8Bytes("SECURITY_AUDIT")),
    WALLET_ANALYSIS: ethers.utils.keccak256(ethers.utils.toUtf8Bytes("WALLET_ANALYSIS")),
    BLOCKCHAIN_ANALYSIS: ethers.utils.keccak256(ethers.utils.toUtf8Bytes("BLOCKCHAIN_ANALYSIS")),
    AI_ASSISTANT_DASHBOARD: ethers.utils.keccak256(ethers.utils.toUtf8Bytes("AI_ASSISTANT_DASHBOARD")),
    SOCIAL_WEB3_ANALYSIS: ethers.utils.keccak256(ethers.utils.toUtf8Bytes("SOCIAL_WEB3_ANALYSIS"))
  };
  
  console.log("\n=== Verificación de Herramientas Registradas ===");
  console.log(`Total de herramientas a verificar: ${Object.keys(TOOL_IDS).length} (11 herramientas)`);
  
  for (const [toolName, toolId] of Object.entries(TOOL_IDS)) {
    try {
      const price = await dashboardContract.toolPrices(toolId);
      const isRegistered = price.gt(0);
      
      console.log(`\n${toolName}:`);
      console.log(`  ID: ${toolId}`);
      console.log(`  Registrada: ${isRegistered}`);
      console.log(`  Precio: ${ethers.utils.formatUnits(price, 18)} USDC`);
      
      if (!isRegistered) {
        console.log(`  ⚠️  ADVERTENCIA: ${toolName} no está registrada`);
      }
    } catch (error) {
      console.log(`  ❌ Error verificando ${toolName}: ${error.message}`);
    }
  }
  
  // Verificar tokens aceptados
  const TOKENS = {
    USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    DAI: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7"
  };
  
  console.log("\nVerificando tokens aceptados:");
  
  for (const [name, address] of Object.entries(TOKENS)) {
    const isAccepted = await dashboardContract.acceptedTokens(address);
    console.log(`${name} (${address}): ${isAccepted ? 'Aceptado' : 'No aceptado'}`);
  }
  
  // Verificar descuento para auditoría completa
  const discount = await dashboardContract.completeAuditDiscountPercentage();
  console.log(`\nDescuento para auditoría completa: ${discount}%`);
  
  // Verificar cálculo de precios para auditoría completa
  const allToolIds = Object.values(TOOL_IDS);
  const [totalPriceBeforeDiscount, finalPrice, isCompleteAuditOffer] = 
    await dashboardContract.getToolsPrice(TOKENS.USDC, allToolIds);
  
  console.log("\nCálculo de precios para auditoría completa:");
  console.log(`  - Precio total antes de descuento: ${ethers.utils.formatUnits(totalPriceBeforeDiscount, 6)} USDC`);
  console.log(`  - Precio final con descuento: ${ethers.utils.formatUnits(finalPrice, 6)} USDC`);
  console.log(`  - ¿Es oferta de auditoría completa?: ${isCompleteAuditOffer}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });