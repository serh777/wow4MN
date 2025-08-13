import { ethers, Log, Interface, InterfaceAbi } from 'ethers';

/**
 * Decodifica un evento según su ABI
 * @param log Log del evento a decodificar
 * @param abi ABI del contrato o interfaz
 * @returns Evento decodificado con valores y nombres
 */
export function parseEvent(
  log: Log,
  abi: InterfaceAbi
): {
  name: string;
  signature: string;
  args: Record<string, any>;
} | null {
  try {
    // Crear una interfaz a partir del ABI
    const iface = new Interface(abi);
    
    // Intentar parsear el log
    const parsedLog = iface.parseLog(log);
    
    if (!parsedLog) return null;
    
    // Convertir los argumentos a un objeto
    const args: Record<string, any> = {};
    
    // Añadir argumentos indexados y no indexados
    for (let i = 0; i < parsedLog.args.length; i++) {
      // Si el argumento tiene nombre, usarlo como clave
      if (parsedLog.args[i] !== undefined) {
        // Para argumentos con nombre
        if (parsedLog.args[i] && typeof parsedLog.args[i] === 'object' && parsedLog.args[i].hasOwnProperty('_isIndexed')) {
          // Es un argumento indexado
          args[i.toString()] = parsedLog.args[i].hash;
        } else {
          // Argumento normal
          args[i.toString()] = parsedLog.args[i];
        }
      }
    }
    
    // Añadir argumentos con nombre
    for (const key in parsedLog.args) {
      if (isNaN(Number(key))) {
        // Es un nombre de argumento, no un índice
        const value = parsedLog.args[key];
        if (value && typeof value === 'object' && value.hasOwnProperty('_isIndexed')) {
          // Es un argumento indexado
          args[key] = value.hash;
        } else {
          // Argumento normal
          args[key] = value;
        }
      }
    }
    
    return {
      name: parsedLog.name,
      signature: parsedLog.signature,
      args,
    };
  } catch (error) {
    console.error('Error al parsear evento:', error);
    return null;
  }
}