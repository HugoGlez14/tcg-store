import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Política de privacidad | TCG Store",
  description:
    "Política de privacidad y tratamiento de datos de TCG Store.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Información legal"
      title="Política de privacidad"
      intro="En TCG Store buscamos utilizar únicamente la información necesaria para operar la tienda, gestionar cuentas, procesar pedidos y ofrecer atención a nuestros clientes."
      sections={[
        {
          title: "Información que recopilamos",
          paragraphs: [
            "Podemos recopilar información cuando creas una cuenta, inicias sesión con Google, realizas una compra o te comunicas con nosotros.",
          ],
          bullets: [
            "Nombre y dirección de correo electrónico.",
            "Imagen de perfil proporcionada por Google, cuando aplique.",
            "Información necesaria para preparar y entregar pedidos.",
            "Datos relacionados con pedidos, productos adquiridos y estado de pago.",
            "Información técnica básica necesaria para seguridad y funcionamiento de la plataforma.",
          ],
        },

        {
          title: "Inicio de sesión con Google",
          paragraphs: [
            "Cuando eliges iniciar sesión con Google, utilizamos el servicio de autenticación para identificar tu cuenta. Podemos recibir datos básicos como tu nombre, correo electrónico e imagen de perfil.",
            "TCG Store no recibe ni almacena tu contraseña de Google.",
          ],
        },

        {
          title: "Uso de la información",
          bullets: [
            "Crear y administrar tu cuenta.",
            "Procesar compras y pedidos.",
            "Brindar soporte y atención al cliente.",
            "Informar sobre el estado de una compra.",
            "Prevenir actividades fraudulentas o usos indebidos.",
            "Mejorar la operación y experiencia de la tienda.",
          ],
        },

        {
          title: "Pagos",
          paragraphs: [
            "Los pagos podrán ser procesados mediante proveedores externos especializados. TCG Store no necesita almacenar directamente los datos completos de tu tarjeta bancaria cuando el pago es gestionado por dichos proveedores.",
          ],
        },

        {
          title: "Proveedores tecnológicos",
          paragraphs: [
            "Para operar la tienda podemos utilizar servicios tecnológicos externos para alojamiento, autenticación, base de datos, procesamiento de pagos, correo electrónico o logística.",
            "Estos proveedores reciben únicamente la información necesaria para prestar sus servicios conforme a sus propias políticas y condiciones.",
          ],
        },

        {
          title: "Seguridad",
          paragraphs: [
            "Aplicamos medidas técnicas y administrativas razonables destinadas a proteger la información contra acceso no autorizado, pérdida, alteración o divulgación indebida.",
            "Sin embargo, ningún sistema conectado a Internet puede garantizar seguridad absoluta.",
          ],
        },

        {
          title: "Tus derechos",
          paragraphs: [
            "Puedes solicitar acceso, corrección, actualización o eliminación de tus datos personales cuando corresponda, así como manifestar dudas relacionadas con el tratamiento de tu información.",
          ],
        },

        {
          title: "Cambios a esta política",
          paragraphs: [
            "Esta política podrá actualizarse para reflejar cambios en la tienda, proveedores, funcionalidades o requisitos aplicables. La versión vigente será la publicada en esta página.",
          ],
        },
      ]}
    />
  );
}