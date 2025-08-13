const { ethers, upgrades } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Desplegando contratos con la cuenta:", deployer.address);

  // Dirección de tesorería inicial
  const treasuryAddress = "0x22A8CaCaD8d3C88EBf76B6AC378448F7197A0364";
  
  // Desplegar el contrato principal
  const DashboardToolsContract = await ethers.getContractFactory("DashboardToolsContract");
  const dashboardContract = await upgrades.deployProxy(DashboardToolsContract, [
    treasuryAddress
  ]);
  await dashboardContract.deployed();
  
  console.log("DashboardToolsContract desplegado en:", dashboardContract.address);
  
  // Configurar tokens aceptados (direcciones de mainnet)
  const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  const USDT = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
  
  await dashboardContract.addAcceptedToken(USDC, true);
  await dashboardContract.addAcceptedToken(DAI, true);
  await dashboardContract.addAcceptedToken(USDT, true);
  
  console.log("Tokens aceptados configurados");
  
  // Configurar precios de herramientas
  const TOOL_IDS = {
    METADATA_ANALYSIS: ethers.utils.keccak256(ethers.utils.toUtf8Bytes("METADATA_ANALYSIS")),
    CONTENT_AUDIT: ethers.utils.keccak256(ethers.utils.toUtf8Bytes("CONTENT_AUDIT")),
    KEYWORD_ANALYSIS: ethers.utils.keccak256(ethers.utils.toUtf8Bytes("KEYWORD_ANALYSIS")),
    LINK_VERIFICATION: ethers.utils.keccak256(ethers.utils.toUtf8Bytes("LINK_VERIFICATION")),
    PERFORMANCE_ANALYSIS: ethers.utils.keccak256(ethers.utils.toUtf8Bytes("PERFORMANCE_ANALYSIS")),
    COMPETITION_ANALYSIS: ethers.utils.keccak256(ethers.utils.toUtf8Bytes("COMPETITION_ANALYSIS")),
    BLOCKCHAIN_ANALYSIS: ethers.utils.keccak256(ethers.utils.toUtf8Bytes("BLOCKCHAIN_ANALYSIS")),
    AI_ASSISTANT_DASHBOARD: ethers.utils.keccak256(ethers.utils.toUtf8Bytes("AI_ASSISTANT_DASHBOARD")),
    SOCIAL_WEB3_ANALYSIS: ethers.utils.keccak256(ethers.utils.toUtf8Bytes("SOCIAL_WEB3_ANALYSIS"))
  };
  
  // Precios en USDC (6 decimales)
  await dashboardContract.setToolPrice(TOOL_IDS.METADATA_ANALYSIS, ethers.utils.parseUnits("5", 6));
  await dashboardContract.setToolPrice(TOOL_IDS.CONTENT_AUDIT, ethers.utils.parseUnits("5", 6));
  await dashboardContract.setToolPrice(TOOL_IDS.KEYWORD_ANALYSIS, ethers.utils.parseUnits("5", 6));
  await dashboardContract.setToolPrice(TOOL_IDS.LINK_VERIFICATION, ethers.utils.parseUnits("5", 6));
  await dashboardContract.setToolPrice(TOOL_IDS.PERFORMANCE_ANALYSIS, ethers.utils.parseUnits("5", 6));
  await dashboardContract.setToolPrice(TOOL_IDS.COMPETITION_ANALYSIS, ethers.utils.parseUnits("5", 6));
  await dashboardContract.setToolPrice(TOOL_IDS.BLOCKCHAIN_ANALYSIS, ethers.utils.parseUnits("5", 6));
  await dashboardContract.setToolPrice(TOOL_IDS.AI_ASSISTANT_DASHBOARD, ethers.utils.parseUnits("7", 6));
  await dashboardContract.setToolPrice(TOOL_IDS.SOCIAL_WEB3_ANALYSIS, ethers.utils.parseUnits("5", 6));
  
  console.log("Precios de herramientas configurados");
  
  // Configurar descuento para auditoría completa
  await dashboardContract.setCompleteAuditDiscountPercentage(10); // 10%
  
  console.log("Descuento para auditoría completa configurado");
  
  console.log("Configuración inicial completada");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });