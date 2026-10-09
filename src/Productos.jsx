import React, { useState, useEffect } from 'react';

const CLAVE_PRODUCTOS = 'electrofactura_productos';

function Productos() {
  const [productos, setProductos] = useState(() => {
    try {
      const guardados = localStorage.getItem(CLAVE_PRODUCTOS);
      return guardados ? JSON.parse(guardados) : [];
    } catch {
      return [];
    }
  });

  const [busqueda, setBusqueda] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoId, setEditandoId] = useState(null);

  const formularioInicial = {
    codigo: '',
    nombre: '',
    descripcion: '',
    precio: '',
    existencia: '',
  };

  const [formulario, setFormulario] = useState(formularioInicial);

  useEffect(() => {
    localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(productos));
  }, [productos]);

  const manejarCambio = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value,
    });
  };

  const guardarProducto = (e) => {
    e.preventDefault();

    if (!formulario.nombre.trim()) {
      alert('El nombre del producto es obligatorio.');
      return;
    }

    const precio = Number(formulario.precio);
    const existencia = Number(formulario.existencia);

    if (formulario.precio === '' || !Number.isFinite(precio) || precio < 0) {
      alert('Ingresa un precio válido, igual o mayor que cero.');
      return;
    }

    if (
      formulario.existencia === '' ||
      !Number.isInteger(existencia) ||
      existencia < 0
    ) {
      alert('Ingresa una existencia entera, igual o mayor que cero.');
      return;
    }

    const codigo = formulario.codigo.trim();

    if (
      productos.some(
        (p) =>
          p.codigo &&
          codigo &&
          p.codigo.toLowerCase() === codigo.toLowerCase() &&
          p.id !== editandoId
      )
    ) {
      alert('Ya existe un producto con ese código.');
      return;
    }

    if (editandoId !== null) {
      setProductos((actuales) =>
        actuales.map((p) =>
          p.id === editandoId
            ? { ...p, ...formulario, codigo, precio, existencia }
            : p
        )
      );
    } else {
      setProductos((actuales) => [
        ...actuales,
        {
          ...formulario,
          codigo,
          precio,
          existencia,
          id: Date.now(),
        },
      ]);
    }

    setFormulario(formularioInicial);
    setEditandoId(null);
    setMostrarFormulario(false);
  };

  const editarProducto = (producto) => {
    setFormulario({
      codigo: producto.codigo || '',
      nombre: producto.nombre || '',
      descripcion: producto.descripcion || '',
      precio: String(producto.precio),
      existencia: String(producto.existencia),
    });
    setEditandoId(producto.id);
    setMostrarFormulario(true);
  };

  const eliminarProducto = (id) => {
    if (window.confirm('¿Deseas eliminar este producto?')) {
      setProductos((actuales) => actuales.filter((p) => p.id !== id));
    }
  };

  const cancelarFormulario = () => {
    setFormulario(formularioInicial);
    setEditandoId(null);
    setMostrarFormulario(false);
  };

  const productosFiltrados = productos.filter((p) =>
    `${p.codigo} ${p.nombre} ${p.descripcion}`
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  const formatoPrecio = (precio) =>
    `Q ${Number(precio).toFixed(2)}`;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Gestión de Productos</h1>
          <p>Administra el inventario de ElectroFactura.</p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (mostrarFormulario) {
              cancelarFormulario();
            } else {
              setMostrarFormulario(true);
            }
          }}
        >
          {mostrarFormulario ? 'Cancelar' : '+ Nuevo producto'}
        </button>
      </div>

      {mostrarFormulario && (
        <form onSubmit={guardarProducto} className="client-form">
          <h2>
            {editandoId !== null ? 'Editar producto' : 'Registrar producto'}
          </h2>

          <label>
            Código del producto
            <input
              name="codigo"
              value={formulario.codigo}
              onChange={manejarCambio}
              placeholder="Ej. ELEC-001"
            />
          </label>

          <label>
            Nombre del producto *
            <input
              name="nombre"
              value={formulario.nombre}
              onChange={manejarCambio}
              required
              placeholder="Ej. Cable eléctrico"
            />
          </label>

          <label>
            Descripción
            <textarea
              name="descripcion"
              value={formulario.descripcion}
              onChange={manejarCambio}
              placeholder="Marca, calibre, medida u otros detalles"
              rows="3"
            />
          </label>

          <label>
            Precio de venta (Q) *
            <input
              type="number"
              name="precio"
              value={formulario.precio}
              onChange={manejarCambio}
              min="0"
              step="0.01"
              required
              placeholder="0.00"
            />
          </label>

          <label>
            Existencia inicial *
            <input
              type="number"
              name="existencia"
              value={formulario.existencia}
              onChange={manejarCambio}
              min="0"
              step="1"
              required
              placeholder="0"
            />
          </label>

          <button type="submit">
            {editandoId !== null ? 'Guardar cambios' : 'Guardar producto'}
          </button>
        </form>
      )}

      <div className="client-list">
        <h2>Productos registrados: {productos.length}</h2>

        <input
          type="search"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por código, nombre o descripción..."
        />

        {productosFiltrados.length === 0 ? (
          <p>
            {productos.length === 0
              ? 'Todavía no hay productos registrados.'
              : 'No se encontraron productos.'}
          </p>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Existencia</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {productosFiltrados.map((producto) => (
                  <tr key={producto.id}>
                    <td>{producto.codigo || '—'}</td>
                    <td>
                      <strong>{producto.nombre}</strong>
                      {producto.descripcion && (
                        <div>{producto.descripcion}</div>
                      )}
                    </td>
                    <td>{formatoPrecio(producto.precio)}</td>
                    <td>{producto.existencia}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => editarProducto(producto)}
                      >
                        Editar
                      </button>{' '}
                      <button
                        type="button"
                        onClick={() => eliminarProducto(producto.id)}
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

export default Productos;