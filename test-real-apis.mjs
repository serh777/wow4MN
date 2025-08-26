// Script de prueba para verificar APIs reales
import { EtherscanService } from './src/services/apis/etherscan.js';
import { AnthropicService } from './src/services/apis/anthropic.js';

// Direcciones de prueba conocidas
const TEST_ADDRESSES = {
  // Contrato USDC (conocido y verificado)
  USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  // Contrato CryptoKitties (NFT conocido)
  CRYPTOKITTIES: '0x06012c8cf97BEaD5deAe237070F9587f8E7A266d',
  // Wallet conocida de Vitalik
  VITALIK: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
};

async function testEtherscanAPI() {
  console.log('🔍 Probando Etherscan API...');
  
  try {
    // Probar con contrato USDC
    const contractInfo = await EtherscanService.getContractInfo(TEST_ADDRESSES.USDC);
    console.log('✅ Información de contrato obtenida:', contractInfo ? 'Éxito' : 'Sin datos');
    
    // Probar balance
    const balance = await EtherscanService.getAccountBalance(TEST_ADDRESSES.VITALIK);
    console.log('✅ Balance obtenido:', balance ? 'Éxito' : 'Sin datos');
    
    // Probar transacciones
    const transactions = await EtherscanService.getContractTransactions(TEST_ADDRESSES.USDC, 1, 5);
    console.log('✅ Transacciones obtenidas:', transactions.length, 'transacciones');
    
    return true;
  } catch (error) {
    console.error('❌ Error en Etherscan API:', error.message);
    return false;
  }
}

async function testAnthropicAPI() {
  console.log('🤖 Probando Anthropic API...');
  
  try {
    const anthropic = new AnthropicService();
    const result = await anthropic.chatWithAI('Hola, ¿puedes responder con "API funcionando"?');
    console.log('✅ Respuesta de IA:', result.substring(0, 50) + '...');
    return true;
  } catch (error) {
    console.error('❌ Error en Anthropic API:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Iniciando pruebas de APIs reales...\n');
  
  const etherscanResult = await testEtherscanAPI();
  console.log('');
  const anthropicResult = await testAnthropicAPI();
  
  console.log('\n📊 Resumen de pruebas:');
  console.log('- Etherscan API:', etherscanResult ? '✅ Funcionando' : '❌ Error');
  console.log('- Anthropic API:', anthropicResult ? '✅ Funcionando' : '❌ Error');
  
  if (etherscanResult && anthropicResult) {
    console.log('\n🎉 Todas las APIs están funcionando correctamente!');
  } else {
    console.log('\n⚠️ Algunas APIs tienen problemas. Revisa las configuraciones.');
  }
}

// Ejecutar pruebas
runTests().catch(console.error);