import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Inicializar Resend solo si la API key está disponible
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, subject, message } = body;

    // Validar que todos los campos requeridos estén presentes
    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Formato de email inválido' },
        { status: 400 }
      );
    }

    // Si no hay API key de Resend, usar fallback (log)
    if (!resend) {
      console.log('RESEND_API_KEY no configurada. Mensaje registrado:', {
        de: `${firstName} ${lastName} <${email}>`,
        para: 'srhskl@proton.me',
        asunto: subject,
        mensaje: message,
        timestamp: new Date().toISOString()
      });

      return NextResponse.json(
        { 
          success: true, 
          message: 'Mensaje registrado (modo desarrollo)',
          details: {
            from: `${firstName} ${lastName}`,
            email: email,
            subject: subject
          }
        },
        { status: 200 }
      );
    }

    // Enviar email usando Resend
    const emailData = await resend.emails.send({
      from: 'WowSeoWeb3 <onboarding@resend.dev>', // Usando dominio verificado de Resend
      to: ['srhskl@proton.me'],
      subject: `Nuevo mensaje de contacto: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            Nuevo mensaje desde WowSeoWeb3
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Nombre:</strong> ${firstName} ${lastName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Asunto:</strong> ${subject}</p>
          </div>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #333;">Mensaje:</h3>
            <div style="background-color: #ffffff; padding: 15px; border-left: 4px solid #007bff; border-radius: 4px;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; color: #6c757d; font-size: 12px;">
            <p>Este mensaje fue enviado desde el formulario de contacto de WowSeoWeb3</p>
            <p>Fecha: ${new Date().toLocaleString('es-ES')}</p>
          </div>
        </div>
      `,
      replyTo: email // Permite responder directamente al remitente
    });

    console.log('Email enviado exitosamente:', emailData.data?.id);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Mensaje enviado correctamente',
        details: {
          from: `${firstName} ${lastName}`,
          email: email,
          subject: subject,
          emailId: emailData.data?.id
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error al enviar el mensaje de contacto:', error);
    
    // Si es un error de Resend, proporcionar más detalles
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          error: 'Error al enviar el mensaje',
          details: process.env.NODE_ENV === 'development' ? error.message : 'Error interno del servidor'
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Ejemplo de integración con Nodemailer (comentado)
/*
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransporter({
  host: 'smtp.proton.me',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const mailOptions = {
  from: process.env.EMAIL_USER,
  to: 'srhskl@proton.me',
  subject: `Nuevo mensaje de contacto: ${subject}`,
  html: `
    <h2>Nuevo mensaje desde WowSeoWeb3</h2>
    <p><strong>Nombre:</strong> ${firstName} ${lastName}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Asunto:</strong> ${subject}</p>
    <p><strong>Mensaje:</strong></p>
    <p>${message}</p>
  `
};

await transporter.sendMail(mailOptions);
*/