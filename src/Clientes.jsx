import React, { useState, useEffect } from 'react';

const CLAVE_CLIENTES = 'electrofactura_clientes';

function obtenerClientesGuardados() {
  try {
    const datos = localStorage.getItem(CLAVE_CLIENTES);
    return datos ? JSON.parse(datos) : [];
  } catch (error) {
    console.error('Error al recuperar clientes:', error);
    return [];
  }
}

function Clientes() {
  const [clientes, setClientes] = useState(obtenerClientesGuardados);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  const [formulario, setFormulario] = useState({
    nombre: '',
    nit: '',
    telefono: '',
    correo: '',
    direccion: '',
  });

  // Guardar los clientes cuando la lista cambie
  useEffect(() => {
    try {
      localStorage.setItem(
        CLAVE_CLIENTES,
        JSON.stringify(clientes)
      );
    } catch (error) {
      console.error('Error al guardar clientes:', error);
      alert('No se pudieron guardar los clientes en el navegador.');
    }
  }, [clientes]);

  const manejarCambio = (e) => {
    const { name, value } = e.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  };

  const guardarCliente = (e) => {
    e.preventDefault();

    if (!formulario.nombre.trim()) {
      alert('El nombre del cliente es obligatorio.');
      return;
    }

    const nuevoCliente = {
      ...formulario,
      nombre: formulario.nombre.trim(),
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    };

    setClientes((anteriores) => [
      ...anteriores,
      nuevoCliente,
    ]);

    setFormulario({
      nombre: '',
      nit: '',
      telefono: '',
      correo: '',
      direccion: '',
    });

    setMostrarFormulario(false);
  };

  const eliminarCliente = (id) => {
    if (window.confirm('¿Deseas eliminar este cliente?')) {
      setClientes((anteriores) =>
        anteriores.filter((cliente) => cliente.id !== id)
      );
    }
  };

  const textoBusqueda = busqueda.toLowerCase().trim();

  const clientesFiltrados = clientes.filter((cliente) =>
    `${cliente.nombre} ${cliente.nit} ${cliente.telefono} ${cliente.correo}`
      .toLowerCase()
      .includes(textoBusqueda)
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Gestión de Clientes</h1>
          <p>Administra los clientes de ElectroFactura.</p>
        </div>

        <button
          type="button"
          onClick={() => setMostrarFormulario((anterior) => !anterior)}
        >
          {mostrarFormulario ? 'Cancelar' : '+ Nuevo cliente'}
        </button>
      </div>

      {mostrarFormulario && (
        <form onSubmit={guardarCliente} className="client-form">
          <h2>Registrar nuevo cliente</h2>

          <label>
            Nombre completo o empresa *
            <input
              name="nombre"
              value={formulario.nombre}
              onChange={manejarCambio}
              required
              placeholder="Nombre del cliente"
            />
          </label>

          <label>
            NIT
            <input
              name="nit"
              value={formulario.nit}
              onChange={manejarCambio}
              placeholder="Número de identificación tributaria"
            />
          </label>

          <label>
            Teléfono
            <input
              name="telefono"
              value={formulario.telefono}
              onChange={manejarCambio}
              placeholder="Número de teléfono"
            />
          </label>

          <label>
            Correo electrónico
            <input
              type="email"
              name="correo"
              value={formulario.correo}
              onChange={manejarCambio}
              placeholder="correo@ejemplo.com"
            />
          </label>

          <label>
            Dirección
            <textarea
              name="direccion"
              value={formulario.direccion}
              onChange={manejarCambio}
              placeholder="Dirección del cliente"
              rows="3"
            />
          </label>

          <button type="submit">Guardar cliente</button>
        </form>
      )}

      <div className="client-list">
        <h2>Clientes registrados: {clientes.length}</h2>

        <input
          type="search"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre, NIT o teléfono..."
        />

        {clientesFiltrados.length === 0 ? (
          <p>
            {clientes.length === 0
              ? 'Todavía no hay clientes registrados.'
              : 'No se encontraron clientes.'}
          </p>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>NIT</th>
                  <th>Teléfono</th>
                  <th>Correo</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {clientesFiltrados.map((cliente) => (
                  <tr key={cliente.id}>
                    <td>{cliente.nombre}</td>
                    <td>{cliente.nit || '—'}</td>
                    <td>{cliente.telefono || '—'}</td>
                    <td>{cliente.correo || '—'}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => eliminarCliente(cliente.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Clientes;