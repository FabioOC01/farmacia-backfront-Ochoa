import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid detail ID provided.' });
  }

  if (req.method === 'GET') {
    try {
      const detalle = await prisma.detalleOrdenVta.findUnique({
        where: { id: id },
      });
      if (!detalle) {
        return res.status(404).json({ message: 'DetalleOrdenVta not found.' });
      }
      res.status(200).json(detalle);
    } catch (error) {
      console.error('Error fetching detalleOrdenVta by ID:', error);
      res.status(500).json({ message: 'Error fetching detalleOrdenVta' });
    }
  } else if (req.method === 'PUT') {
    const { NroOrdenVta, CodMedicamento, descripcionMed, cantidadRequerida } = req.body;
    try {
      const updatedDetalle = await prisma.detalleOrdenVta.update({
        where: { id: id },
        data: {
          NroOrdenVta, 
          CodMedicamento,
          descripcionMed,
          cantidadRequerida,
        },
      });
      res.status(200).json(updatedDetalle);
    } catch (error: any) {
      console.error('Error updating detalleOrdenVta:', error);
      if (error.code === 'P2025') {
        res.status(404).json({ message: 'DetalleOrdenVta not found for update.' });
      } else if (error.code === 'P2003') { 
        res.status(400).json({ message: 'The specified NroOrdenVta does not exist.', error: error.message });
      } else if (error.code === 'P2002') { 
        res.status(409).json({ message: 'The updated combination of NroOrdenVta and CodMedicamento already exists.', error: error.message });
      } else {
        res.status(500).json({ message: 'Error updating detalleOrdenVta', error: error.message });
      }
    }
  } else if (req.method === 'DELETE') {
    try {
      const deletedDetalle = await prisma.detalleOrdenVta.delete({
        where: { id: id },
      });
      res.status(200).json({ message: 'DetalleOrdenVta deleted successfully.', deletedDetalle });
    } catch (error: any) {
      console.error('Error deleting detalleOrdenVta:', error);
      if (error.code === 'P2025') {
        res.status(404).json({ message: 'DetalleOrdenVta not found for deletion.' });
      } else {
        res.status(500).json({ message: 'Error deleting detalleOrdenVta', error: error.message });
      }
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}