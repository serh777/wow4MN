const { ethers } = require("hardhat");

async function main() {
  const [deployer, user] = await ethers.getSigners();
  
  // Dirección del contrato desplegado
  const contractAddress = "TU_DIRECCIÓN_DE_CONTRATO_DESPLEGADO";
  const dashboardContract = await ethers.getContractAt("DashboardToolsContract", contractAddress);
  
  // Desplegar token mock para pruebas
  const MockERC20 = await ethers.getContractFactory("MockERC20");
  const mockUSDC = await MockERC20.deploy("USD Coin", "USDC", 6);
  await mockUSDC.deployed();
  
  // Añadir token mock como aceptado
  await dashboardContract.addAcceptedToken(mockUSDC.address, true);
  
  // Acuñar tokens para el usuario
  await mockUSDC.mint(user.address, ethers.utils.parseUnits("1000", 6));
  
  // Aprobar gasto de tokens
  await mockUSDC.connect(user).approve(dashboardContract.address, ethers.utils.parseUnits("1000", 6));
  
  // Simular compra de herramientas individuales
  const TOOL_IDS = {
    METADATA_ANALYSIS: ethers.utils.keccak256(ethers.utils.toUtf8Bytes("METADATA_ANALYSIS")),
    CONTENT_AUDIT: ethers.utils.keccak256(ethers.utils.toUtf8Bytes("CONTENT_AUDIT")),
    AI_ASSISTANT_DASHBOARD: ethers.utils.keccak256(ethers.utils.toUtf8Bytes("AI_ASSISTANT_DASHBOARD"))
  };
  
  console.log("Simulando compra de herramientas individuales...");
  
  // Comprar una herramienta
  const singleToolId = [TOOL_IDS.METADATA_ANALYSIS];
  await dashboardContract.connect(user).payForTools(mockUSDC.address, singleToolId);
  console.log("Compra de una herramienta completada");
  
  // Comprar múltiples herramientas
  const multipleToolIds = [TOOL_IDS.CONTENT_AUDIT, TOOL_IDS.AI_ASSISTANT_DASHBOARD];
  await dashboardContract.connect(user).payForTools(mockUSDC.address, multipleToolIds);
  console.log("Compra de múltiples herramientas completada");
  
  // Verificar balance de tesorería
  const treasuryBalance = await mockUSDC.balanceOf(await dashboardContract.treasuryAddress());
  console.log(`Balance de tesorería: ${ethers.utils.formatUnits(treasuryBalance, 6)} USDC`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });