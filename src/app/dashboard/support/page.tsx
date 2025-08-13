import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function SupportPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Centro de Soporte</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Preguntas Frecuentes</CardTitle>
              <CardDescription>
                Encuentra respuestas rápidas a las preguntas más comunes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>¿Cómo puedo conectar mi wallet?</AccordionTrigger>
                  <AccordionContent>
                    Para conectar tu wallet, haz clic en el botón &quot;Conectar Wallet&quot; en la esquina superior derecha. 
                    Selecciona tu proveedor preferido (MetaMask, WalletConnect, etc.) y sigue las instrucciones en pantalla.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger>¿Qué redes blockchain son compatibles?</AccordionTrigger>
                  <AccordionContent>
                    Actualmente soportamos Ethereum, Polygon, Binance Smart Chain y Avalanche. 
                    Estamos trabajando para añadir más redes en el futuro.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger>¿Cómo funciona el análisis SEO para Web3?</AccordionTrigger>
                  <AccordionContent>
                    Nuestro análisis SEO para Web3 combina técnicas tradicionales de SEO con análisis específicos 
                    para contenido blockchain. Evaluamos factores como la relevancia de keywords, optimización técnica, 
                    y también elementos específicos de Web3 como la integración con contratos inteligentes y metadatos de NFTs.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger>¿Puedo exportar mis informes?</AccordionTrigger>
                  <AccordionContent>
                    Sí, todos los informes pueden ser exportados en formato PDF, CSV o compartidos directamente 
                    mediante un enlace. Encuentra la opción de exportación en la esquina superior derecha de cada informe.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5">
                  <AccordionTrigger>¿Cómo puedo cancelar mi suscripción?</AccordionTrigger>
                  <AccordionContent>
                    Puedes cancelar tu suscripción en cualquier momento desde la sección &quot;Configuración {`>`} Cuenta {`>`} Suscripción&quot;.
                    Tu acceso continuará hasta el final del período de facturación actual.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recursos de Ayuda</CardTitle>
              <CardDescription>
                Explora nuestra documentación y tutoriales.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-blue-600 hover:underline">Guía de inicio rápido</a>
                </li>
                <li>
                  <a href="#" className="text-blue-600 hover:underline">Tutoriales en video</a>
                </li>
                <li>
                  <a href="#" className="text-blue-600 hover:underline">Documentación de la API</a>
                </li>
                <li>
                  <a href="#" className="text-blue-600 hover:underline">Mejores prácticas SEO para Web3</a>
                </li>
                <li>
                  <a href="#" className="text-blue-600 hover:underline">Glosario de términos</a>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>¿Necesitas Ayuda Personalizada?</CardTitle>
              <CardDescription>
                Para consultas específicas, soporte técnico o colaboraciones, utiliza nuestros canales oficiales de contacto.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Link href="/contact">
                  <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
                    Ir a Página de Contacto
                  </Button>
                </Link>
                <p className="text-sm text-muted-foreground text-center">
                  En la página de contacto encontrarás nuestro formulario oficial y todos nuestros canales de comunicación.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Canales de Comunicación</CardTitle>
              <CardDescription>
                Conéctate con nosotros a través de nuestros canales oficiales.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">WhatsApp Personal</h3>
                  <p className="text-sm text-muted-foreground mb-2">Para consultas urgentes y soporte personalizado</p>
                  <a href="https://wa.me/34625293300?text=Hola,%20me%20interesa%20conocer%20más%20sobre%20WowSeoWeb3" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-800 text-sm">+34 625 293 300</a>
                </div>
                
                <div>
                  <h3 className="font-medium">Grupo WhatsApp</h3>
                  <p className="text-sm text-muted-foreground mb-2">Únete a nuestra comunidad Web3</p>
                  <a href="https://whatsapp.com/channel/0029VaoBWqRGzzKSLnw0uk0y" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm">Unirse al Grupo</a>
                </div>
                
                <div>
                  <h3 className="font-medium">X (Twitter)</h3>
                  <p className="text-sm text-muted-foreground mb-2">Síguenos para actualizaciones y noticias</p>
                  <a href="https://x.com/wowseoweb3?t=EMTpbcHb-QF-FEcNH3arw&s=09" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-800 text-sm">@wowseoweb3</a>
                </div>
                
                <div>
                  <h3 className="font-medium">Horario de Atención</h3>
                  <p className="text-sm text-muted-foreground">Lunes a Viernes: 9:00 - 18:00 (CET)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}