 import { useState } from 'react'
import './App.css'
import Clientes from './Clientes.jsx'

const menuItems = [
  { id: 'inicio', icon: '🏠', label: 'Inicio' },
  { id: 'clientes', icon: '👥', label: 'Clientes' },
  { id: 'productos', icon: '📦', label: 'Productos' },
  { id: 'servicios', icon: '🔧', label: 'Servicios' },
  { id: 'cotizaciones', icon: '📝', label: 'Cotizaciones' },
  { id: 'facturas', icon: '🧾', label: 'Facturas' },
  { id: 'pagos', icon: '💰', label: 'Pagos' },
  { id: 'reportes', icon: '📊', label: 'Reportes' },
]

function App() {
  const [activeView, setActiveView] = useState('inicio')

  const activeItem = menuItems.find((item) => item.id === activeView)

  const renderContent = () => {
    if (activeView === 'inicio') {
      return (
        <>
          <div className="welcome">
            <div>
              <span className="welcome-label">PANEL PRINCIPAL</span>
              <h1>Bienvenido a ElectroFactura</h1>
              <p>
                Administra tus clientes, productos, servicios,
                cotizaciones y facturas desde un solo lugar.
              </p>
            </div>

            <div className="welcome-icon">⚡</div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon blue">👥</div>
              <div>
                <span>Clientes</span>
                <strong>0</strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon green">📦</div>
              <div>
                <span>Productos</span>
                <strong>0</strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon orange">📝</div>
              <div>
                <span>Cotizaciones</span>
                <strong>0</strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon purple">🧾</div>
              <div>
                <span>Facturas</span>
                <strong>0</strong>
              </div>
            </div>
          </div>

          <div className="dashboard-grid">
            <section className="panel">
              <div className="panel-header">
                <div>
                  <h2>Acciones rápidas</h2>
                  <p>Accede rápidamente a las funciones principales.</p>
                </div>
              </div>

              <div className="quick-actions">
                <button onClick={() => setActiveView('clientes')}>
                  <span>👥</span>
                  <strong>Nuevo cliente</strong>
                  <small>Registrar cliente</small>
                </button>

                <button onClick={() => setActiveView('productos')}>
                  <span>📦</span>
                  <strong>Nuevo producto</strong>
                  <small>Agregar producto</small>
                </button>

                <button onClick={() => setActiveView('cotizaciones')}>
                  <span>📝</span>
                  <strong>Nueva cotización</strong>
                  <small>Crear cotización</small>
                </button>

                <button onClick={() => setActiveView('facturas')}>
                  <span>🧾</span>
                  <strong>Nueva factura</strong>
                  <small>Emitir factura</small>
                </button>
              </div>
            </section>

            <section className="panel">
              <div className="panel-header">
                <div>
                  <h2>Actividad reciente</h2>
                  <p>Movimientos recientes del sistema.</p>
                </div>
              </div>

              <div className="empty-state">
                <div>📋</div>
                <strong>Aún no hay actividad</strong>
                <span>
                  Cuando registres operaciones aparecerán aquí.
                </span>
              </div>
            </section>
          </div>
        </>
      )
    }

   if (activeView === 'clientes') {
  return <Clientes />
}

return (
  <section className="module-placeholder">
    <div className="module-icon">{activeItem?.icon}</div>
    <span className="welcome-label">MÓDULO</span>
    <h1>{activeItem?.label}</h1>
    <p>Este módulo será desarrollado en el siguiente paso.</p>
    <button onClick={() => setActiveView('inicio')}>
      ← Volver al inicio
    </button>
  </section>
)
}
  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">⚡</div>
          <div>
            <strong>ElectroFactura</strong>
            <span>Gestión empresarial</span>
          </div>
        </div>

        <div className="menu-title">MENÚ PRINCIPAL</div>

        <nav>
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`menu-item ${
                activeView === item.id ? 'active' : ''
              }`}
              onClick={() => setActiveView(item.id)}
            >
              <span className="menu-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button
            className={`menu-item ${
              activeView === 'configuracion' ? 'active' : ''
            }`}
            onClick={() => setActiveView('configuracion')}
          >
            <span className="menu-icon">⚙️</span>
            <span>Configuración</span>
          </button>

          <div className="user-card">
            <div className="user-avatar">A</div>
            <div>
              <strong>Administrador</strong>
              <span>Cuenta principal</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <span className="breadcrumb">ElectroFactura</span>
            <span className="separator">/</span>
            <span>{activeItem?.label || 'Configuración'}</span>
          </div>

          <div className="topbar-actions">
            <button className="icon-button" title="Notificaciones">
              🔔
            </button>
            <button className="profile-button">
              <span className="user-avatar small">A</span>
              <span>Administrador</span>
              <span>⌄</span>
            </button>
          </div>
        </header>

        <div className="content">{renderContent()}</div>
      </main>
    </div>
  )
}

export default App