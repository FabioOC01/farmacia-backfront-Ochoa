'use client'; // Esta directiva es necesaria para usar useState y useEffect en el App Router

import React, { useState, useEffect } from 'react';

// Interfaces para los datos de las tablas
interface DetalleOrdenVta {
  id: string;
  NroOrdenVta: string;
  CodMedicamento: string;
  descripcionMed: string;
  cantidadRequerida: number;
}

interface OrdenVenta {
  NroOrdenVta: string;
  fechaEmision: string; // O Date si lo parseas
  Motivo?: string;
  Situacion?: string;
  DetalleOrdenVta: DetalleOrdenVta[];
}

// Componente de modal para crear/editar OrdenVenta
const OrdenVentaModal = ({ isOpen, onClose, onSave, ordenVentaToEdit }: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  ordenVentaToEdit?: OrdenVenta;
}) => {
  const [NroOrdenVta, setNroOrdenVta] = useState(ordenVentaToEdit?.NroOrdenVta || '');
  // Formato para input type="date" es YYYY-MM-DD
  const [fechaEmision, setFechaEmision] = useState(ordenVentaToEdit?.fechaEmision ? new Date(ordenVentaToEdit.fechaEmision).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
  const [Motivo, setMotivo] = useState(ordenVentaToEdit?.Motivo || '');
  const [Situacion, setSituacion] = useState(ordenVentaToEdit?.Situacion || '');

  // Efecto para rellenar el formulario cuando se edita una orden
  useEffect(() => {
    if (ordenVentaToEdit) {
      setNroOrdenVta(ordenVentaToEdit.NroOrdenVta);
      setFechaEmision(new Date(ordenVentaToEdit.fechaEmision).toISOString().split('T')[0]);
      setMotivo(ordenVentaToEdit.Motivo || '');
      setSituacion(ordenVentaToEdit.Situacion || '');
    } else {
      // Reiniciar formulario para una nueva orden
      setNroOrdenVta('');
      setFechaEmision(new Date().toISOString().split('T')[0]);
      setMotivo('');
      setSituacion('');
    }
  }, [ordenVentaToEdit]);


  if (!isOpen) return null; // No renderizar el modal si no está abierto

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Llama a la función onSave pasada por props
    onSave({
      NroOrdenVta,
      fechaEmision: new Date(fechaEmision).toISOString(), // Asegúrate de enviar en formato ISO para la API
      Motivo,
      Situacion,
    });
    onClose(); // Cierra el modal después de guardar
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <h2>{ordenVentaToEdit ? 'Editar Orden de Venta' : 'Nueva Orden de Venta'}</h2>
        <form onSubmit={handleSubmit} style={formStyle}>
          <label style={labelStyle}>
            Nro. Orden Venta:
            <input
              type="text"
              value={NroOrdenVta}
              onChange={(e) => setNroOrdenVta(e.target.value)}
              required
              style={inputStyle}
              disabled={!!ordenVentaToEdit} // Deshabilita el campo si estás editando (NroOrdenVta es clave primaria)
            />
          </label>
          <label style={labelStyle}>
            Fecha Emisión:
            <input
              type="date"
              value={fechaEmision}
              onChange={(e) => setFechaEmision(e.target.value)}
              required
              style={inputStyle}
            />
          </label>
          <label style={labelStyle}>
            Motivo:
            <input
              type="text"
              value={Motivo}
              onChange={(e) => setMotivo(e.target.value)}
              style={inputStyle}
            />
          </label>
          <label style={labelStyle}>
            Situación:
            <input
              type="text"
              value={Situacion}
              onChange={(e) => setSituacion(e.target.value)}
              style={inputStyle}
            />
          </label>
          <div style={modalActionsStyle}>
            <button type="submit" style={{ ...buttonStyle, backgroundColor: '#007bff' }}>Guardar</button>
            <button type="button" onClick={onClose} style={{ ...buttonStyle, backgroundColor: '#6c757d', marginLeft: '10px' }}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Componente de modal para mostrar/añadir DetalleOrdenVta
const DetalleOrdenVtaModal = ({ isOpen, onClose, ordenVenta, onDetalleSave }: {
  isOpen: boolean;
  onClose: () => void;
  ordenVenta?: OrdenVenta; // La orden a la que pertenece el detalle
  onDetalleSave: (detalle: Omit<DetalleOrdenVta, 'id'>) => Promise<void>;
}) => {
  const [CodMedicamento, setCodMedicamento] = useState('');
  const [descripcionMed, setDescripcionMed] = useState('');
  const [cantidadRequerida, setCantidadRequerida] = useState(1);

  if (!isOpen || !ordenVenta) return null; // No renderizar si no está abierto o no hay orden

  const handleAddDetalle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (ordenVenta?.NroOrdenVta) {
      await onDetalleSave({
        NroOrdenVta: ordenVenta.NroOrdenVta,
        CodMedicamento,
        descripcionMed,
        cantidadRequerida,
      });
      // Limpiar formulario después de añadir
      setCodMedicamento('');
      setDescripcionMed('');
      setCantidadRequerida(1);
    }
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <h2>Detalles de Orden: {ordenVenta.NroOrdenVta}</h2>
        <h3 style={{marginTop: '20px', marginBottom: '10px'}}>Añadir Nuevo Detalle</h3>
        <form onSubmit={handleAddDetalle} style={formStyle}>
          <label style={labelStyle}>
            Cód. Medicamento:
            <input
              type="text"
              value={CodMedicamento}
              onChange={(e) => setCodMedicamento(e.target.value)}
              required
              style={inputStyle}
            />
          </label>
          <label style={labelStyle}>
            Descripción:
            <input
              type="text"
              value={descripcionMed}
              onChange={(e) => setDescripcionMed(e.target.value)}
              required
              style={inputStyle}
            />
          </label>
          <label style={labelStyle}>
            Cantidad:
            <input
              type="number"
              value={cantidadRequerida}
              onChange={(e) => setCantidadRequerida(parseInt(e.target.value))}
              min="1"
              required
              style={inputStyle}
            />
          </label>
          <button type="submit" style={{ ...buttonStyle, backgroundColor: '#28a745' }}>Añadir Detalle</button>
        </form>

        <h3 style={{marginTop: '30px', marginBottom: '10px'}}>Detalles Existentes</h3>
        {ordenVenta.DetalleOrdenVta && ordenVenta.DetalleOrdenVta.length > 0 ? (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Cód. Med</th>
                <th style={thStyle}>Descripción</th>
                <th style={thStyle}>Cantidad</th>
                <th style={thStyle}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ordenVenta.DetalleOrdenVta.map((detalle) => (
                <tr key={detalle.id}>
                  <td style={tdStyle}>{detalle.CodMedicamento}</td>
                  <td style={tdStyle}>{detalle.descripcionMed}</td>
                  <td style={tdStyle}>{detalle.cantidadRequerida}</td>
                  <td style={tdStyle}>
                    {/* Aquí podrías añadir botones para editar/eliminar detalles específicos */}
                    <button style={{ ...buttonStyle, backgroundColor: '#ffc107', marginRight: '5px', padding: '5px 8px' }}>
                      ✏️
                    </button>
                    <button style={{ ...buttonStyle, backgroundColor: '#dc3545', padding: '5px 8px' }}>
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay detalles para esta orden aún.</p>
        )}
        <div style={modalActionsStyle}>
          <button type="button" onClick={onClose} style={{ ...buttonStyle, backgroundColor: '#6c757d' }}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};


// Componente principal de la página de Ventas
const VentasPage = () => {
  const [ordenesVenta, setOrdenesVenta] = useState<OrdenVenta[]>([]);
  const [isOrdenModalOpen, setIsOrdenModalOpen] = useState(false);
  const [ordenToEdit, setOrdenToEdit] = useState<OrdenVenta | undefined>(undefined);
  const [isDetalleModalOpen, setIsDetalleModalOpen] = useState(false);
  const [selectedOrdenForDetails, setSelectedOrdenForDetails] = useState<OrdenVenta | undefined>(undefined);

  // Función para cargar las órdenes de venta desde la API
  const fetchOrdenesVenta = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/ordenVentas');
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      const data: OrdenVenta[] = await res.json();
      setOrdenesVenta(data);
    } catch (error) {
      console.error('Error fetching ordenes de venta:', error);
      alert('Error al cargar las órdenes de venta.'); // Usamos alert para simplicidad, en prod usar un componente modal
    }
  };

  // Cargar órdenes al montar el componente
  useEffect(() => {
    fetchOrdenesVenta();
  }, []); // El array vacío asegura que se ejecuta solo una vez al montar

  // Manejador para crear una nueva orden de venta
  const handleCreateOrden = async (data: any) => {
    try {
      const res = await fetch('http://localhost:1/api/ordenVentas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`Error ${res.status}: ${errorData.message || res.statusText}`);
      }
      alert('Orden de venta creada exitosamente!');
      fetchOrdenesVenta(); // Recarga la lista para mostrar la nueva orden
    } catch (error: any) {
      console.error('Error creando orden de venta:', error);
      alert('Error al crear la orden de venta: ' + error.message);
    }
  };

  // Manejador para actualizar una orden de venta existente
  const handleUpdateOrden = async (data: any) => {
    try {
      const res = await fetch(`http://localhost:3001/api/ordenVentas/${data.NroOrdenVta}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`Error ${res.status}: ${errorData.message || res.statusText}`);
      }
      alert('Orden de venta actualizada exitosamente!');
      fetchOrdenesVenta(); // Recarga la lista para mostrar los cambios
    } catch (error: any) {
      console.error('Error actualizando orden de venta:', error);
      alert('Error al actualizar la orden de venta: ' + error.message);
    }
  };

  // Manejador para eliminar una orden de venta
  const handleDeleteOrden = async (NroOrdenVta: string) => {
    // Confirmación antes de eliminar
    if (!confirm(`¿Estás seguro de que quieres eliminar la orden ${NroOrdenVta} y todos sus detalles?`)) {
      return;
    }
    try {
      const res = await fetch(`http://localhost:3001/api/ordenVentas/${NroOrdenVta}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`Error ${res.status}: ${errorData.message || res.statusText}`);
      }
      alert('Orden de venta eliminada exitosamente!');
      fetchOrdenesVenta(); // Recarga la lista después de eliminar
    } catch (error: any) {
      console.error('Error eliminando orden de venta:', error);
      alert('Error al eliminar la orden de venta: ' + error.message);
    }
  };

  // Manejador para añadir un detalle a una orden de venta
  const handleAddDetalleToOrden = async (detalleData: Omit<DetalleOrdenVta, 'id'>) => {
    try {
      const res = await fetch('http://localhost:3001/api/detalleOrdenVentas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(detalleData),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`Error ${res.status}: ${errorData.message || res.statusText}`);
      }
      alert('Detalle añadido exitosamente!');
  
      fetchOrdenesVenta();

      setSelectedOrdenForDetails(prevOrden => {
        if (prevOrden) {
         
          const newDetailWithTempId: DetalleOrdenVta = { ...detalleData, id: `temp-${Date.now()}` };
          return {
            ...prevOrden,
            DetalleOrdenVta: [...prevOrden.DetalleOrdenVta, newDetailWithTempId]
          };
        }
        return prevOrden;
      });

    } catch (error: any) {
      console.error('Error añadiendo detalle:', error);
      alert('Error al añadir detalle: ' + error.message);
    }
  };


  return (
    <div style={containerStyle}>
      {/* En App Router, <Head> de 'next/head' no se usa directamente para metadatos de la página.
          En su lugar, puedes exportar un objeto 'metadata' de tu page.tsx o layout.tsx.
          Por simplicidad, lo quitamos aquí ya que no es vital para la funcionalidad.
          El título se puede manejar en app/layout.tsx
      */}

      <h1>Gestión de Órdenes de Venta</h1>

      <button
        onClick={() => { setOrdenToEdit(undefined); setIsOrdenModalOpen(true); }}
        style={{ ...buttonStyle, backgroundColor: '#dc3545', marginBottom: '20px' }} // Similar a tu botón "Nuevo Cliente"
      >
        Nueva Orden de Venta
      </button>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Nro. Orden</th>
            <th style={thStyle}>Fecha Emisión</th>
            <th style={thStyle}>Motivo</th>
            <th style={thStyle}>Situación</th>
            <th style={thStyle}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ordenesVenta.map((orden) => (
            <tr key={orden.NroOrdenVta}>
              <td style={tdStyle}>{orden.NroOrdenVta}</td>
              <td style={tdStyle}>{new Date(orden.fechaEmision).toLocaleDateString()}</td>
              <td style={tdStyle}>{orden.Motivo}</td>
              <td style={tdStyle}>{orden.Situacion}</td>
              <td style={tdStyle}>
                <button
                  onClick={() => { setSelectedOrdenForDetails(orden); setIsDetalleModalOpen(true); }}
                  style={{ ...buttonStyle, backgroundColor: '#007bff', marginRight: '5px' }}
                >
                  Ver Detalles
                </button>
                <button
                  onClick={() => { setOrdenToEdit(orden); setIsOrdenModalOpen(true); }}
                  style={{ ...buttonStyle, backgroundColor: '#ffc107', marginRight: '5px' }}
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDeleteOrden(orden.NroOrdenVta)}
                  style={{ ...buttonStyle, backgroundColor: '#dc3545' }}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal para crear/editar órdenes de venta */}
      <OrdenVentaModal
        isOpen={isOrdenModalOpen}
        onClose={() => setIsOrdenModalOpen(false)}
        onSave={ordenToEdit ? handleUpdateOrden : handleCreateOrden}
        ordenVentaToEdit={ordenToEdit}
      />

      {/* Modal para ver/añadir detalles de una orden específica */}
      <DetalleOrdenVtaModal
        isOpen={isDetalleModalOpen}
        onClose={() => {
          setIsDetalleModalOpen(false);
          fetchOrdenesVenta(); // Recarga las órdenes al cerrar el modal de detalles para asegurar datos actualizados
        }}
        ordenVenta={selectedOrdenForDetails}
        onDetalleSave={handleAddDetalleToOrden}
      />
    </div>
  );
};

export default VentasPage;


// Estilos básicos (pueden y deberían ir en un archivo CSS aparte o en un módulo CSS para proyectos reales)
const containerStyle: React.CSSProperties = {
  maxWidth: '1200px',
  margin: '20px auto',
  padding: '20px',
  backgroundColor: '#f9f9f9',
  borderRadius: '8px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  fontFamily: '"Inter", sans-serif', // Fuente Inter como se recomienda
};

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '20px',
  backgroundColor: 'white',
  borderRadius: '8px', // Bordes redondeados
  overflow: 'hidden', // Asegura que los bordes redondeados se apliquen al contenido de la tabla
};

const thStyle: React.CSSProperties = {
  backgroundColor: '#e9ecef', // Un color claro para el encabezado de la tabla
  padding: '12px',
  textAlign: 'left',
  borderBottom: '1px solid #dee2e6',
  color: '#343a40',
};

const tdStyle: React.CSSProperties = {
  padding: '12px',
  borderBottom: '1px solid #dee2e6',
  verticalAlign: 'middle',
};

const buttonStyle: React.CSSProperties = {
  color: 'white',
  padding: '8px 12px',
  border: 'none',
  borderRadius: '4px', // Bordes redondeados
  cursor: 'pointer',
  fontSize: '0.9rem',
  transition: 'background-color 0.3s ease', // Transición suave al pasar el ratón
};

const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalContentStyle: React.CSSProperties = {
  backgroundColor: 'white',
  padding: '30px',
  borderRadius: '8px', // Bordes redondeados
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
  maxWidth: '700px',
  width: '90%',
  maxHeight: '80vh',
  overflowY: 'auto', // Para permitir scroll si el contenido es largo
  position: 'relative',
};

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
  marginTop: '20px',
};

const labelStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  fontSize: '0.95rem',
  fontWeight: 'bold',
  color: '#343a40',
};

const inputStyle: React.CSSProperties = {
  padding: '10px',
  border: '1px solid #ced4da',
  borderRadius: '4px', // Bordes redondeados
  marginTop: '5px',
  fontSize: '1rem',
};

const modalActionsStyle: React.CSSProperties = {
  marginTop: '20px',
  display: 'flex',
  justifyContent: 'flex-end',
};
