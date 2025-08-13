# Cómo Registrar Nuevas Herramientas en el Contrato

## Método 1: Usando Hardhat Script

### Paso 1: Actualizar la dirección del contrato
Edita `scripts/register-new-tools.js` y cambia:
```javascript
const CONTRACT_ADDRESS = "TU_DIRECCION_DEL_CONTRATO_AQUI";
```
Por la dirección real de tu contrato desplegado.

### Paso 2: Ejecutar el script
```bash
npx hardhat run scripts/register-new-tools.js --network <tu-red>
```

## Método 2: Llamadas Directas al Contrato

### Usando ethers.js en código:
```javascript
// Conectar al contrato
const contract = new ethers.Contract(contractAddress, abi, signer);

// Calcular los IDs de las herramientas
const BACKLINKS_ANALYSIS = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("BACKLINKS_ANALYSIS"));
const SECURITY_AUDIT = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("SECURITY_AUDIT"));
const WALLET_ANALYSIS = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("WALLET_ANALYSIS"));

// Registrar herramientas (5 USDC = 5000000 con 6 decimales)
const price = ethers.utils.parseUnits("5", 6);

await contract.setToolPrice(BACKLINKS_ANALYSIS, price);
await contract.setToolPrice(SECURITY_AUDIT, price);
await contract.setToolPrice(WALLET_ANALYSIS, price);
```

### Usando Remix o Etherscan:
1. Ve a la página del contrato en Etherscan
2. Conecta tu wallet
3. Busca la función `setToolPrice`
4. Para cada herramienta, llama:

**BACKLINKS_ANALYSIS:**
- `_toolId`: `0x04e14ea301266c690513c84d1eb6dca11ec45e73ed7aa93e0625b18c086a436a`
- `_price`: `5000000` (5 USDC con 6 decimales)

**SECURITY_AUDIT:**
- `_toolId`: `0x55f6662ac6529eee24e7604a5a1855e579444165481eec8965b0bcb8cf016ad2`
- `_price`: `5000000`

**WALLET_ANALYSIS:**
- `_toolId`: `0xd8c38b241fc68bab2b379496202805325bf971baac65456e5250c04e9356d318`
- `_price`: `5000000`

## IDs de Herramientas (keccak256)

```javascript
// Herramientas existentes
METADATA_ANALYSIS = keccak256("METADATA_ANALYSIS")
CONTENT_AUDIT = keccak256("CONTENT_AUDIT")
KEYWORD_ANALYSIS = keccak256("KEYWORD_ANALYSIS")
LINK_VERIFICATION = keccak256("LINK_VERIFICATION")
PERFORMANCE_ANALYSIS = keccak256("PERFORMANCE_ANALYSIS")
BLOCKCHAIN_ANALYSIS = keccak256("BLOCKCHAIN_ANALYSIS")
AI_ASSISTANT_DASHBOARD = keccak256("AI_ASSISTANT_DASHBOARD")
SOCIAL_WEB3_ANALYSIS = keccak256("SOCIAL_WEB3_ANALYSIS")

// Nuevas herramientas a registrar
BACKLINKS_ANALYSIS = keccak256("BACKLINKS_ANALYSIS")
SECURITY_AUDIT = keccak256("SECURITY_AUDIT")
WALLET_ANALYSIS = keccak256("WALLET_ANALYSIS")
```

## Requisitos

1. **Permisos**: Tu cuenta debe tener el rol `PRICE_ADMIN_ROLE`
2. **Gas**: Cada llamada a `setToolPrice()` consume gas
3. **Red**: Asegúrate de estar en la red correcta donde está desplegado el contrato

## Verificación

Después de registrar, puedes verificar que las herramientas se registraron correctamente:

```javascript
// Verificar si una herramienta está registrada
const isRegistered = await contract.isToolRegistered(toolId);

// Obtener el precio de una herramienta
const price = await contract.toolPrices(toolId);

// Obtener todas las herramientas registradas
const allTools = await contract.registeredToolIds();
console.log("Total herramientas:", allTools.length); // Debería ser 11
```

## Notas Importantes

- Los precios se almacenan en la unidad más pequeña del token (para USDC: 6 decimales)
- 5 USDC = 5,000,000 unidades
- 7 USDC = 7,000,000 unidades
- El contrato automáticamente agrega las herramientas al array `registeredToolIds` cuando se establece un precio > 0
- Si estableces precio = 0, la herramienta se desregistra automáticamente






##  Requisitos Verificados y Guía para Etherscan
### 📋 Requisitos que Necesitas:
1. ✅ Permisos : Tu cuenta debe tener el rol PRICE_ADMIN_ROLE en el contrato
2. ✅ Gas : ETH suficiente para pagar las transacciones (cada setToolPrice() consume gas)
3. ✅ Red : Estar conectado a la red correcta donde está desplegado el contrato
4. ✅ Wallet : MetaMask u otra wallet compatible conectada
### 🔧 Pasos para Registrar en Etherscan:
1. Ve a la página del contrato en Etherscan

- Busca tu contrato por dirección
- Ve a la pestaña "Contract" → "Write Contract"
2. Conecta tu wallet

- Haz clic en "Connect to Web3"
- Autoriza la conexión con MetaMask
3. Busca la función setToolPrice

- Scroll hasta encontrar la función setToolPrice
4. Registra cada herramienta (una por una):

BACKLINKS_ANALYSIS:

- _toolId : 0x04e14ea301266c690513c84d1eb6dca11ec45e73ed7aa93e0625b18c086a436a
- _price : 5000000
SECURITY_AUDIT:

- _toolId : 0x55f6662ac6529eee24e7604a5a1855e579444165481eec8965b0bcb8cf016ad2
- _price : 5000000
WALLET_ANALYSIS:

- _toolId : 0xd8c38b241fc68bab2b379496202805325bf971baac65456e5250c04e9356d318
- _price : 5000000
### ⚠️ Verificaciones Previas:
Antes de proceder, verifica:

- ¿Tienes la dirección exacta del contrato desplegado?
- ¿Tu wallet tiene el rol PRICE_ADMIN_ROLE ?
- ¿Estás en la red correcta (mainnet, testnet, etc.)?
- ¿Tienes ETH suficiente para gas?
### 🔍 Cómo Verificar Permisos:
En Etherscan, en "Read Contract", busca:

- hasRole : Usa PRICE_ADMIN_ROLE = 0x6f4017d4b23b5b9e5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b y tu dirección
### ✅ Después del Registro:
Verifica que las herramientas se registraron:

- registeredToolIds() : Debería mostrar 11 herramientas
- isToolRegistered() : Verifica cada herramienta individualmente
- toolPrices() : Confirma que el precio es 5000000
Archivos actualizados:

- `how-to-register-tools.md` con los IDs correctos