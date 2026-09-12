import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Términos y condiciones | TCG Store",
  description:
    "Términos y condiciones de uso y compra de TCG Store.",
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Información legal"
      title="Términos y condiciones"
      intro="Estos términos regulan el acceso y utilización de TCG Store, así como las compras realizadas mediante nuestra plataforma."
      sections={[
        {
          title: "Aceptación de los términos",
          paragraphs: [
            "Al navegar, crear una cuenta o realizar una compra en TCG Store aceptas estos términos y las políticas relacionadas disponibles dentro del sitio.",
          ],
        },

        {
          title: "Productos",
          paragraphs: [
            "TCG Store comercializa productos relacionados con juegos de cartas coleccionables, incluyendo producto sellado, accesorios, coleccionables y otros artículos publicados en el catálogo.",
            "Las fotografías son ilustrativas y pueden existir pequeñas variaciones de presentación dependiendo de la edición o fabricante.",
          ],
        },

        {
          title: "Precios",
          paragraphs: [
            "Los precios publicados serán los mostrados al momento de realizar la compra, salvo errores evidentes de captura o sistema.",
            "Los precios y promociones pueden modificarse sin previo aviso para compras futuras.",
          ],
        },

        {
          title: "Disponibilidad",
          paragraphs: [
            "Todos los productos están sujetos a disponibilidad.",
            "Agregar un producto al carrito no garantiza su existencia hasta que la compra haya sido confirmada correctamente.",
          ],
        },

        {
          title: "Pagos",
          paragraphs: [
            "Una compra se considerará confirmada una vez que el sistema o proveedor de pagos confirme la operación.",
            "Cuando un pago sea rechazado, cancelado o permanezca pendiente, el pedido podrá mantenerse sin procesar hasta recibir confirmación.",
          ],
        },

        {
          title: "Preventas",
          paragraphs: [
            "Los productos identificados como preventa tienen fechas estimadas de disponibilidad y pueden estar sujetos a cambios determinados por fabricantes o distribuidores.",
            "Cuando un pedido incluya productos en preventa junto con artículos disponibles, el envío podrá realizarse una vez que todos los productos estén disponibles, salvo que se indique lo contrario.",
          ],
        },

        {
          title: "Cancelaciones y devoluciones",
          paragraphs: [
            "Las solicitudes de cancelación o devolución serán evaluadas de acuerdo con el estado del pedido, las condiciones del producto y las disposiciones aplicables.",
            "Los productos abiertos, manipulados o cuyo empaque haya sido alterado pueden no ser elegibles para devolución cuando su naturaleza lo justifique.",
          ],
        },

        {
          title: "Cuenta del usuario",
          paragraphs: [
            "El usuario es responsable de mantener la seguridad de su cuenta y de proporcionar información correcta durante una compra.",
            "Podremos restringir cuentas utilizadas para fraude, abuso, intentos de acceso no autorizado o incumplimiento de estos términos.",
          ],
        },

        {
          title: "Propiedad intelectual",
          paragraphs: [
            "Las marcas, nombres de juegos, ilustraciones y personajes pertenecen a sus respectivos propietarios.",
            "El diseño, estructura, textos propios y demás contenido original de TCG Store no podrá ser reproducido sin autorización cuando corresponda.",
          ],
        },

        {
          title: "Modificaciones",
          paragraphs: [
            "Podemos actualizar estos términos cuando sea necesario. La versión vigente será aquella publicada dentro de TCG Store.",
          ],
        },
      ]}
    />
  );
}