const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("DashboardToolsContract", function () {
  let dashboardContract;
  let owner, user1, user2;
  let mockUSDC, mockDAI, mockUSDT;
  
  // Tool IDs según la documentación
  const TOOL_IDS = {
    METADATA_ANALYSIS: ethers.keccak256(ethers.toUtf8Bytes("METADATA_ANALYSIS")),
    CONTENT_AUDIT: ethers.keccak256(ethers.toUtf8Bytes("CONTENT_AUDIT")),
    KEYWORD_ANALYSIS: ethers.keccak256(ethers.toUtf8Bytes("KEYWORD_ANALYSIS")),
    LINK_VERIFICATION: ethers.keccak256(ethers.toUtf8Bytes("LINK_VERIFICATION")),
    PERFORMANCE_ANALYSIS: ethers.keccak256(ethers.toUtf8Bytes("PERFORMANCE_ANALYSIS")),
    COMPETITION_ANALYSIS: ethers.keccak256(ethers.toUtf8Bytes("COMPETITION_ANALYSIS")),
    BLOCKCHAIN_ANALYSIS: ethers.keccak256(ethers.toUtf8Bytes("BLOCKCHAIN_ANALYSIS")),
    AI_ASSISTANT_DASHBOARD: ethers.keccak256(ethers.toUtf8Bytes("AI_ASSISTANT_DASHBOARD")),
    SOCIAL_WEB3_ANALYSIS: ethers.keccak256(ethers.toUtf8Bytes("SOCIAL_WEB3_ANALYSIS"))
  };
  
  // Precios iniciales según la documentación
  const TOOL_PRICES = {
    [TOOL_IDS.METADATA_ANALYSIS]: ethers.parseUnits("5", 6), // 5 USDC (6 decimales)
    [TOOL_IDS.CONTENT_AUDIT]: ethers.parseUnits("5", 6),
    [TOOL_IDS.KEYWORD_ANALYSIS]: ethers.parseUnits("5", 6),
    [TOOL_IDS.LINK_VERIFICATION]: ethers.parseUnits("5", 6),
    [TOOL_IDS.PERFORMANCE_ANALYSIS]: ethers.parseUnits("5", 6),
    [TOOL_IDS.COMPETITION_ANALYSIS]: ethers.parseUnits("5", 6),
    [TOOL_IDS.BLOCKCHAIN_ANALYSIS]: ethers.parseUnits("5", 6),
    [TOOL_IDS.AI_ASSISTANT_DASHBOARD]: ethers.parseUnits("7", 6),
    [TOOL_IDS.SOCIAL_WEB3_ANALYSIS]: ethers.parseUnits("5", 6)
  };
  
  beforeEach(async function () {
    // Obtener cuentas para pruebas
    [owner, user1, user2] = await ethers.getSigners();
    
    // Desplegar tokens mock para pruebas
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    mockUSDC = await MockERC20.deploy("USD Coin", "USDC", 6);
    mockDAI = await MockERC20.deploy("Dai Stablecoin", "DAI", 18);
    mockUSDT = await MockERC20.deploy("Tether USD", "USDT", 6);
    
    // Desplegar el contrato principal
    const DashboardToolsContract = await ethers.getContractFactory("DashboardToolsContract");
    dashboardContract = await upgrades.deployProxy(DashboardToolsContract, [
      owner.address, // initialAdmin
      owner.address, // initialEmitter
      owner.address, // initialPauser
      owner.address, // initialUpgrader
      owner.address, // initialUriWhitelistAdmin
      owner.address, // initialPriceAdmin
      owner.address, // initialTokenAdmin
      owner.address, // treasuryAddress inicial
      10 // _initialDiscountPercentage
    ]);
    await dashboardContract.waitForDeployment();
    
    // Configurar tokens aceptados
    await dashboardContract.addAcceptedToken(await mockUSDC.getAddress());
    await dashboardContract.addAcceptedToken(await mockDAI.getAddress());
    await dashboardContract.addAcceptedToken(await mockUSDT.getAddress());
    
    // Configurar precios de herramientas
    for (const [toolId, price] of Object.entries(TOOL_PRICES)) {
      await dashboardContract.setToolPrice(toolId, price);
    }
    
    // Acuñar tokens para el usuario de prueba
    await mockUSDC.mint(user1.address, ethers.parseUnits("1000", 6));
    await mockDAI.mint(user1.address, ethers.parseUnits("1000", 18));
    await mockUSDT.mint(user1.address, ethers.parseUnits("1000", 6));
    
    // Aprobar gasto de tokens
    await mockUSDC.connect(user1).approve(await dashboardContract.getAddress(), ethers.parseUnits("1000", 6));
    await mockDAI.connect(user1).approve(await dashboardContract.getAddress(), ethers.parseUnits("1000", 18));
    await mockUSDT.connect(user1).approve(await dashboardContract.getAddress(), ethers.parseUnits("1000", 6));
  });

  describe("Configuración inicial", function () {
    it("Debería configurar correctamente la dirección de tesorería", async function () {
      expect(await dashboardContract.treasuryAddress()).to.equal(owner.address);
    });
    
    it("Debería configurar correctamente los tokens aceptados", async function () {
      expect(await dashboardContract.acceptedTokens(await mockUSDC.getAddress())).to.be.true;
      expect(await dashboardContract.acceptedTokens(await mockDAI.getAddress())).to.be.true;
      expect(await dashboardContract.acceptedTokens(await mockUSDT.getAddress())).to.be.true;
    });
    
    it("Debería configurar correctamente los precios de las herramientas", async function () {
      for (const [toolId, price] of Object.entries(TOOL_PRICES)) {
        const storedPrice = await dashboardContract.toolPrices(toolId);
        expect(storedPrice.toString()).to.equal(price.toString());
      }
    });
    
    it("Debería configurar correctamente el descuento para auditoría completa", async function () {
      const discountPercentage = await dashboardContract.completeAuditDiscountPercentage();
      expect(discountPercentage.toString()).to.equal("10");
    });
  });

  describe("Cálculo de precios", function () {
    it("Debería calcular correctamente el precio de una herramienta individual", async function () {
      const toolIds = [TOOL_IDS.METADATA_ANALYSIS];
      const result = await dashboardContract.getToolsPrice(await mockUSDC.getAddress(), toolIds);
      const [totalPriceBeforeDiscount, finalPrice, isCompleteAuditOffer] = result;
      
      expect(totalPriceBeforeDiscount.toString()).to.equal(TOOL_PRICES[TOOL_IDS.METADATA_ANALYSIS].toString());
      expect(finalPrice.toString()).to.equal(TOOL_PRICES[TOOL_IDS.METADATA_ANALYSIS].toString());
      expect(isCompleteAuditOffer).to.be.false;
    });
    
    it("Debería calcular correctamente el precio de múltiples herramientas sin descuento", async function () {
      const toolIds = [
        TOOL_IDS.METADATA_ANALYSIS,
        TOOL_IDS.CONTENT_AUDIT,
        TOOL_IDS.KEYWORD_ANALYSIS
      ];
      
      const expectedPrice = TOOL_PRICES[TOOL_IDS.METADATA_ANALYSIS] + 
        TOOL_PRICES[TOOL_IDS.CONTENT_AUDIT] + 
        TOOL_PRICES[TOOL_IDS.KEYWORD_ANALYSIS];
      
      const result = await dashboardContract.getToolsPrice(await mockUSDC.getAddress(), toolIds);
      const [totalPriceBeforeDiscount, finalPrice, isCompleteAuditOffer] = result;
      
      expect(totalPriceBeforeDiscount.toString()).to.equal(expectedPrice.toString());
      expect(finalPrice.toString()).to.equal(expectedPrice.toString());
      expect(isCompleteAuditOffer).to.be.false;
    });
    
    it("Debería aplicar descuento para auditoría completa", async function () {
      // Crear array con todas las herramientas
      const toolIds = Object.values(TOOL_IDS);
      
      const result = await dashboardContract.getToolsPrice(await mockUSDC.getAddress(), toolIds);
      const [totalPriceBeforeDiscount, finalPrice, isCompleteAuditOffer] = result;
      
      // Calcular precio esperado (47 USDC)
      const expectedTotalPrice = ethers.parseUnits("47", 6);
      
      // Calcular precio con descuento (47 - 10% = 42.3 USDC)
      const expectedFinalPrice = expectedTotalPrice * 90n / 100n;
      
      expect(totalPriceBeforeDiscount.toString()).to.equal(expectedTotalPrice.toString());
      expect(finalPrice.toString()).to.equal(expectedFinalPrice.toString());
      expect(isCompleteAuditOffer).to.be.true;
    });
  });

  describe("Pagos", function () {
    it("Debería procesar correctamente el pago por una herramienta", async function () {
      const toolIds = [TOOL_IDS.METADATA_ANALYSIS];
      const expectedPrice = TOOL_PRICES[TOOL_IDS.METADATA_ANALYSIS];
      
      const treasuryBalanceBefore = await mockUSDC.balanceOf(owner.address);
      
      await dashboardContract.connect(user1).payForTools(await mockUSDC.getAddress(), toolIds);
      
      const treasuryBalanceAfter = await mockUSDC.balanceOf(owner.address);
      const balanceDifference = treasuryBalanceAfter - treasuryBalanceBefore;
      
      expect(balanceDifference.toString()).to.equal(expectedPrice.toString());
    });
    
    it("Debería procesar correctamente el pago por múltiples herramientas con descuento", async function () {
      const toolIds = Object.values(TOOL_IDS);
      
      const treasuryBalanceBefore = await mockUSDC.balanceOf(owner.address);
      
      await dashboardContract.connect(user1).payForTools(await mockUSDC.getAddress(), toolIds);
      
      const treasuryBalanceAfter = await mockUSDC.balanceOf(owner.address);
      const balanceDifference = treasuryBalanceAfter - treasuryBalanceBefore;
      
      // Precio esperado con descuento (47 - 10% = 42.3 USDC)
      const expectedPrice = ethers.parseUnits("47", 6) * 90n / 100n;
      
      expect(balanceDifference.toString()).to.equal(expectedPrice.toString());
    });
  });
});