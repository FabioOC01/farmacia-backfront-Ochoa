import Link from 'next/link';

export const Navbar = () => {
  return (
    <nav style={{
      backgroundColor: '#1E90FF', 
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: 'white'
    }}>
      <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>
        <Link href="/" style={{ textDecoration: 'none', color: 'white' }}>
          Farmacia Ochoa
        </Link>
      </div>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex' }}>
        <li style={{ marginLeft: '1.5rem' }}>
          <Link href="/" style={{ textDecoration: 'none', color: 'white', fontSize: '1.1rem' }}>
            Inicio
          </Link>
        </li>
        <li style={{ marginLeft: '1.5rem' }}>
          <Link href="/ventas" style={{ textDecoration: 'none', color: 'white', fontSize: '1.1rem' }}>
            Ventas
          </Link>
        </li>
        <li style={{ marginLeft: '1.5rem' }}>
          <Link href="/almacen" style={{ textDecoration: 'none', color: 'white', fontSize: '1.1rem' }}>
            Almacén
          </Link>
        </li>
      </ul>
      {/* Puedes añadir un campo de búsqueda aquí si lo deseas */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input type="text" placeholder="Buscar" style={{ padding: '0.5rem', border: 'none', borderRadius: '4px' }} />
        <button style={{
          backgroundColor: '#007bff', 
          color: 'white',
          padding: '0.5rem 1rem',
          border: 'none',
          borderRadius: '4px',
          marginLeft: '0.5rem',
          cursor: 'pointer'
        }}>Búsqueda</button>
      </div>
    </nav>
  );
};