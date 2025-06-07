import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { nroOrdenVta } = req.query;

  if (!nroOrdenVta || typeof nroOrdenVta !== 'string') {
    return res.status(400).json({ message: 'Invalid NroOrdenVta provided.' });
  }

  if (req.method === 'GET') {
    try {
      const ordenVenta = await prisma.ordenVenta.findUnique({
        where: { NroOrdenVta: nroOrdenVta },
        include: {
          DetalleOrdenVta: true,
        },
      });
      if (!ordenVenta) {
        return res.status(404).json({ message: 'OrdenVenta not found.' });
      }
      res.status(200).json(ordenVenta);
    } catch (error) {
      console.error('Error fetching ordenVenta by ID:', error);
      res.status(500).json({ message: 'Error fetching ordenVenta' });
    }
  } else if (req.method === 'PUT') {
    const { fechaEmision, Motivo, Situacion, detalles } = req.body;
    try {
      const updatedOrdenVenta = await prisma.ordenVenta.update({
        where: { NroOrdenVta: nroOrdenVta },
        data: {
          fechaEmision: fechaEmision ? new Date(fechaEmision) : undefined,
          Motivo,
          Situacion,
        },
        include: {
          DetalleOrdenVta: true,
        },
      });
      res.status(200).json(updatedOrdenVenta);
    } catch (error: any) {
      console.error('Error updating ordenVenta:', error);
      if (error.code === 'P2025') { 
        res.status(404).json({ message: 'OrdenVenta not found for update.' });
      } else {
        res.status(500).json({ message: 'Error updating ordenVenta', error: error.message });
      }
    }
  } else if (req.method === 'DELETE') {
    try {
     
      await prisma.detalleOrdenVta.deleteMany({
        where: { NroOrdenVta: nroOrdenVta },
      });
      const deletedOrdenVenta = await prisma.ordenVenta.delete({
        where: { NroOrdenVta: nroOrdenVta },
      });
      res.status(200).json({ message: 'OrdenVenta and its details deleted successfully.', deletedOrdenVenta });
    } catch (error: any) {
      console.error('Error deleting ordenVenta:', error);
      if (error.code === 'P2025') {
        res.status(404).json({ message: 'OrdenVenta not found for deletion.' });
      } else {
        res.status(500).json({ message: 'Error deleting ordenVenta', error: error.message });
      }
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}