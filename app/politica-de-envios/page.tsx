import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Política de envíos | TCG Store",
  description:
    "Información sobre preparación, envío y entrega de pedidos de TCG Store.",
};

export default function ShippingPage() {
  return (
    <LegalPage
      eyebrow="Compras y entregas"
      title="Política de envíos"
      intro="Aquí encontrarás información general sobre la preparación y entrega de los pedidos realizados en TCG Store."
      sections={[
        {
          title: "Cobertura",
          paragraphs: [
            "Los destinos disponibles serán mostrados durante el proceso de compra. Inicialmente, los envíos podrán estar enfocados dentro de la República Mexicana.",
          ],
        },

        {
          title: "Costo de envío",
          paragraphs: [
            "El costo de envío dependerá del destino, dimensiones del pedido, peso y servicio de mensajería disponible.",
            "El importe correspondiente será informado antes de confirmar la compra.",
          ],
        },

        {
          title: "Preparación del pedido",
          paragraphs: [
            "Los pedidos comenzarán a prepararse después de recibir la confirmación del pago.",
            "Los tiempos de preparación pueden variar durante temporadas de alta demanda, lanzamientos, promociones o preventas.",
          ],
        },

        {
          title: "Tiempo de entrega",
          paragraphs: [
            "Los tiempos mostrados son estimados y comienzan después de que el paquete haya sido entregado a la empresa de mensajería.",
            "Las fechas pueden variar debido a ubicación, condiciones climáticas, días festivos, saturación logística u otras circunstancias fuera de nuestro control.",
          ],
        },

        {
          title: "Seguimiento",
          paragraphs: [
            "Cuando el servicio de mensajería proporcione número de rastreo, éste podrá ser enviado al correo del cliente o mostrado en la información de su pedido.",
          ],
        },

        {
          title: "Dirección incorrecta",
          paragraphs: [
            "Es responsabilidad del cliente verificar que el nombre, teléfono, código postal y dirección proporcionados sean correctos.",
            "Los costos derivados de una reexpedición causada por información incorrecta podrán ser responsabilidad del comprador.",
          ],
        },

        {
          title: "Paquetes dañados",
          paragraphs: [
            "Si el paquete presenta daños visibles al momento de la entrega, recomendamos tomar fotografías del empaque antes de abrirlo y conservar todos los materiales.",
            "Comunícate con nosotros lo antes posible para revisar el caso con la empresa de mensajería.",
          ],
        },

        {
          title: "Pedidos no entregados",
          paragraphs: [
            "Cuando un pedido aparezca como entregado pero no haya sido recibido, deberá notificarse para iniciar la revisión correspondiente con la empresa transportista.",
          ],
        },

        {
          title: "Preventas",
          paragraphs: [
            "Los productos en preventa serán enviados una vez que se encuentren disponibles para distribución.",
            "Las fechas anunciadas por fabricantes o distribuidores pueden modificarse sin que TCG Store tenga control sobre dichos cambios.",
          ],
        },
      ]}
    />
  );
}