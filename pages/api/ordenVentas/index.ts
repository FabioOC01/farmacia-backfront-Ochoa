
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {

    try {
      const ordenVentas = await prisma.ordenVenta.findMany({
        include: {
          DetalleOrdenVta: true, 
        },
      });
      res.status(200).json(ordenVentas);
    } catch (error) {
      console.error('Error fetching ordenVentas:', error);
      res.status(500).json({ message: 'Error fetching ordenVentas' });
    }
  } else if (req.method === 'POST') {
   
    const { NroOrdenVta, fechaEmision, Motivo, Situacion, detalles } = req.body;
    try {
      const newOrdenVenta = await prisma.ordenVenta.create({
        data: {
          NroOrdenVta,
          fechaEmision: new Date(fechaEmision),
          Motivo,
          Situacion,
          DetalleOrdenVta: {
            create: detalles?.map((detail: any) => ({
              CodMedicamento: detail.CodMedicamento,
              descripcionMed: detail.descripcionMed,
              cantidadRequerida: detail.cantidadRequerida,
            })) || [],
          },
        },
        include: {
          DetalleOrdenVta: true,
        },
      });
      res.status(201).json(newOrdenVenta);
    } catch (error: any) {
      console.error('Error creating ordenVenta:', error);
      if (error.code === 'P2002') { 
        res.status(409).json({ message: 'OrdenVenta with this NroOrdenVta already exists.' });
      } else {
        res.status(500).json({ message: 'Error creating ordenVenta', error: error.message });
      }
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}