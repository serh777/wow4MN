# Lógica On-Chain para Pagos por Uso en WowSEOWeb3DashboardContract

Este documento detalla la lógica que se implementará en el nuevo contrato inteligente (nombre pendiente, ej. `WowSEOWeb3DashboardContract.sol`) para gestionar el modelo de pago por uso para las 11 herramientas específicas del dashboard de wowseoweb3.

## 1. Almacenamiento de Datos (Variables de Estado)

Similar al `WowSEOWeb3SEOContract.sol`, pero los `toolId`s y precios iniciales serán para el conjunto de 11 herramientas.

### 1.1. Dirección de Tesorería
   - `address public treasuryAddress;` (Inicializada a `0x22A8CaCaD8d3C88EBf76B6AC378448F7197A0364`)

### 1.2. Tokens de Pago Aceptados
   - `mapping(address => bool) public acceptedTokens;`
   - Inicialmente: USDC, DAI, USDT en Ethereum Mainnet.
     - USDC: `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`
     - DAI: `0x6B175474E89094C44Da98b954EedeAC495271d0F`
     - USDT: `0xdAC17F958D2ee523a2206206994597C13D831ec7`

### 1.3. Precios de las Herramientas (11 herramientas)
   - `mapping(bytes32 => uint256) public toolPrices;`
   - `toolId`s y precios iniciales (denominados en USDC, el contrato asumirá paridad 1:1 para DAI/USDT al procesar pagos, o se requerirá que el admin establezca precios por token si la paridad no se asume):
     1.  **Metadata Analysis:** `keccak256(abi.encodePacked("METADATA_ANALYSIS"))` - 5 USDC
     2.  **Content Audit:** `keccak256(abi.encodePacked("CONTENT_AUDIT"))` - 5 USDC
     3.  **Keyword Analysis:** `keccak256(abi.encodePacked("KEYWORD_ANALYSIS"))` - 5 USDC
     4.  **Link Verification:** `keccak256(abi.encodePacked("LINK_VERIFICATION"))` - 5 USDC
     5.  **Performance Analysis:** `keccak256(abi.encodePacked("PERFORMANCE_ANALYSIS"))` - 5 USDC
     6.  **Backlinks Analysis:** `keccak256(abi.encodePacked("BACKLINKS_ANALYSIS"))` - 5 USDC
     7.  **Security Audit:** `keccak256(abi.encodePacked("SECURITY_AUDIT"))` - 5 USDC
     8.  **Wallet Analysis:** `keccak256(abi.encodePacked("WALLET_ANALYSIS"))` - 5 USDC
     9.  **Blockchain Analysis:** `keccak256(abi.encodePacked("BLOCKCHAIN_ANALYSIS"))` - 5 USDC
     10. **AI Assistant:** `keccak256(abi.encodePacked("AI_ASSISTANT_DASHBOARD"))` - 7 USDC (usamos `_DASHBOARD` para diferenciar del `AI_ASSISTANT` del contrato anterior si fuera necesario, aunque son contratos separados)
     11. **Social Web3 Analysis:** `keccak256(abi.encodePacked("SOCIAL_WEB3_ANALYSIS"))` - 5 USDC

### 1.4. Identificadores de Todas las Herramientas Registradas (para Auditoría Completa)
   - `bytes32[] public registeredToolIds;`
   - `mapping(bytes32 => bool) public isToolRegistered;`
   - Se poblará con los 11 `toolId`s anteriores.

### 1.5. Descuento para Auditoría Completa
   - `uint256 public completeAuditDiscountPercentage;` (Inicialmente 10 para 10%)

## 2. Eventos
   - Idénticos a `WowSEOWeb3SEOContract.sol`: `PaymentMade`, `PriceUpdated`, `AcceptedTokenStatusChanged`, `TreasuryUpdated`, `DiscountPercentageUpdated`.
   - También los eventos originales: `ToolAction`, `ContentHashStored`, `AllowedURIPrefixSet`.

## 3. Funciones Principales

### 3.1. `payForTools(address _tokenAddress, bytes32[] calldata _toolIdsToPurchase)`
   - Lógica idéntica a `WowSEOWeb3SEOContract.sol`, pero la condición de "Auditoría Completa" se verificará contra las 11 herramientas registradas en este contrato.
   - Precio total antes de descuento para auditoría completa: (10 herramientas * 5 USDC) + 7 USDC = 55 USDC.
   - Precio final con 10% descuento: 49.5 USDC.

### 3.2. `getToolsPrice(address _tokenAddress, bytes32[] calldata _toolIdsToPurchase) public view returns (uint256 totalPriceBeforeDiscount, uint256 finalPrice, bool isCompleteAuditOffer)`
   - Lógica idéntica, adaptada a las 11 herramientas.

## 4. Funciones Administrativas
   - Idénticas a `WowSEOWeb3SEOContract.sol`: `setTreasuryAddress`, `addAcceptedToken`, `removeAcceptedToken`, `setToolPrice`, `setCompleteAuditDiscountPercentage`.

## 5. Mejoras de Validación y Seguridad
   - Se mantendrán todas las mejoras y estructuras de `WowSEOWeb3SEOContract.sol` (roles, Pausable, UUPS, validaciones de entrada).

## 6. Consideraciones sobre Decimales de Tokens
   - Idénticas a `WowSEOWeb3SEOContract.sol`. Los precios se almacenarán en la unidad más pequeña del token.

Este diseño servirá como base para el nuevo contrato enfocado en las herramientas del dashboard.
