# Smart Contracts

Esta carpeta contiene los smart contracts del proyecto Web3.

## Estructura

- `contracts/`: Contratos principales
- `interfaces/`: Interfaces de los contratos
- `libraries/`: Bibliotecas auxiliares
- `test/`: Tests de los contratos

## Desarrollo

Para compilar los contratos:

```bash
npx hardhat compile
```

Para ejecutar los tests:

```bash
npx hardhat test
```

## Despliegue

Para desplegar en una red de prueba:

```bash
npx hardhat run scripts/deploy.js --network testnet
```