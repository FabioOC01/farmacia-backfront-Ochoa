import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const detalles = await prisma.detalleOrdenVta.findMany();
      res.status(200).json(detalles);
    } catch (error) {
      console.error('Error fetching detalleOrdenVtas:', error);
      res.status(500).json({ message: 'Error fetching detalleOrdenVtas' });
    }
  } else if (req.method === 'POST') {
  
    const { NroOrdenVta, CodMedicamento, descripcionMed, cantidadRequerida } = req.body;
    try {
      const newDetalle = await prisma.detalleOrdenVta.create({
        data: {
          NroOrdenVta,
          CodMedicamento,
          descripcionMed,
          cantidadRequerida,
        },
      });
      res.status(201).json(newDetalle);
    } catch (error: any) {
      console.error('Error creating detalleOrdenVta:', error);
      if (error.code === 'P2003') { 
        res.status(400).json({ message: 'The specified NroOrdenVta does not exist.', error: error.message });
      } else if (error.code === 'P2002') { 
        res.status(409).json({ message: 'This medicine is already detailed for this order. Consider updating instead.', error: error.message });
      } else {
        res.status(500).json({ message: 'Error creating detalleOrdenVta', error: error.message });
      }
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}