// src/app/services/local-context.service.ts
import { Injectable } from '@angular/core';
import { ContextExample } from './local-context.model';

@Injectable({ providedIn: 'root' })
export class LocalContextService {
  private ejemplos: ContextExample[] = [
    {
      pregunta: '¿Cuánto deberías gastar en transporte público en Cartagena según tu ingreso?',
      valorRecomendado: 'COP 3.000 – 4.000 por viaje',
      explicacion: 'Tarifa vigente de Transcaribe para recorridos urbanos.'
    },
    {
      pregunta: '¿Cuál es el gasto promedio mensual en mototaxi?',
      valorRecomendado: 'COP 250.000',
      explicacion: 'Basado en 4 viajes diarios a COP 2.000 cada uno.'
    },
    {
      pregunta: '¿Cuánto destinar para comidas en playa por semana?',
      valorRecomendado: 'COP 80.000',
      explicacion: 'Incluye almuerzo y snacks en puestos locales.'
    },
    {
      pregunta: '¿Cuál es el costo aproximado del recibo de luz de Afinia?',
      valorRecomendado: 'COP 150.000 – 200.000',
      explicacion: 'Promedio mensual para un hogar de 3 personas.'
    },
    {
        pregunta: '¿Cuánto cuesta alquilar un apartamento en el centro histórico?',
        valorRecomendado: 'COP 1.200.000 - 2.500.000',
        explicacion: 'Varía según tamaño y estado del inmueble.'
      },
      {
        pregunta: 'Precio de mercado para un almuerzo ejecutivo en Bocagrande',
        valorRecomendado: 'COP 15.000 - 25.000',
        explicacion: 'Menú del día en restaurantes de gama media.'
      },
      {
        pregunta: 'Costo mensual de Internet residencial 100MB',
        valorRecomendado: 'COP 120.000 - 180.000',
        explicacion: 'Promedio entre proveedores locales (Claro, Movistar, ETB).'
      },
      {
        pregunta: 'Tarifa diaria de parqueaderos en zonas turísticas',
        valorRecomendado: 'COP 10.000 - 20.000',
        explicacion: 'Centro, Bocagrande y Castillo Grande.'
      },
      {
        pregunta: 'Precio de un café en Juan Valdez vs cafetería local',
        valorRecomendado: 'COP 8.000 vs 4.000',
        explicacion: 'Diferencia entre cadena internacional y puesto de barrio.'
      },
      {
        pregunta: 'Costo de un taxi desde el aeropuerto al centro',
        valorRecomendado: 'COP 25.000 - 35.000',
        explicacion: 'Tarifa aproximada sin taxímetro.'
      },
      {
        pregunta: 'Membresía mensual en gimnasios de cadena',
        valorRecomendado: 'COP 120.000 - 200.000',
        explicacion: 'Smart Fit, Bodytech o gimnasios locales.'
      },
      {
        pregunta: 'Precio de entrada a museos históricos',
        valorRecomendado: 'COP 10.000 - 20.000',
        explicacion: 'Castillo San Felipe, Palacio de la Inquisición.'
      },
      {
        pregunta: 'Costo de un corte de cabello masculino',
        valorRecomendado: 'COP 15.000 - 40.000',
        explicacion: 'Barberías locales vs establecimientos premium.'
      },
      {
        pregunta: 'Precio de una botella de agua en la playa vs supermercado',
        valorRecomendado: 'COP 5.000 vs 2.500',
        explicacion: 'Incremento en zonas turísticas.'
      },
      {
        pregunta: 'Tarifa de lavandería por kilo',
        valorRecomendado: 'COP 8.000 - 12.000',
        explicacion: 'Lavado y planchado básico.'
      },
      {
        pregunta: 'Costo de un seguro básico para moto 125cc',
        valorRecomendado: 'COP 400.000 - 600.000 anual',
        explicacion: 'Cobertura SOAT y todo riesgo.'
      },
      {
        pregunta: 'Gasto mensual promedio en gas natural',
        valorRecomendado: 'COP 30.000 - 50.000',
        explicacion: 'Hogar de 3-4 personas.'
      },
      {
        pregunta: 'Precio de una cena romántica en restaurante playero',
        valorRecomendado: 'COP 80.000 - 150.000 por persona',
        explicacion: 'Incluye entrada, plato principal y bebida.'
      },
      {
        pregunta: 'Costo de clases particulares de inglés por hora',
        valorRecomendado: 'COP 25.000 - 50.000',
        explicacion: 'Dependiendo de la experiencia del profesor.'
      },
      {
        pregunta: 'Precio de mercado para reparar un aire acondicionado',
        valorRecomendado: 'COP 150.000 - 300.000',
        explicacion: 'Incluye mano de obra y recarga de gas.'
      },
      {
        pregunta: 'Cuota mensual de jardín infantil privado',
        valorRecomendado: 'COP 500.000 - 1.200.000',
        explicacion: 'Según prestigio y ubicación.'
      },
      {
        pregunta: 'Costo de un pasaje en lancha a Islas del Rosario',
        valorRecomendado: 'COP 70.000 - 120.000 ida y vuelta',
        explicacion: 'Precios desde el Muelle de la Bodeguita.'
      },
      {
        pregunta: 'Precio de una consulta médica general particular',
        valorRecomendado: 'COP 50.000 - 100.000',
        explicacion: 'Sin incluir exámenes o medicamentos.'
      },
      {
        pregunta: 'Gasto semanal en mercado para soltero/a',
        valorRecomendado: 'COP 150.000 - 250.000',
        explicacion: 'Alimentación básica sin lujos.'
      },
      {
        pregunta: 'Costo de mantenimiento preventivo para auto mediano',
        valorRecomendado: 'COP 400.000 - 600.000',
        explicacion: 'Cambio de aceite, filtros y revisión general.'
      }
  ];

  getEjemplos(): ContextExample[] {
    return this.ejemplos;
  }
}
