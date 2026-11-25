import { Component, useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Link, NavLink, useParams } from 'react-router-dom';
import { products, money } from './data/products';
import { addItem, hydrateCart, total } from './cart';
import ProductCard from './components/ProductCard';
import ProductArt from './components/ProductArt';
import Checkout from './components/Checkout';
import { authenticate, firebaseEnabled, emulatorEnabled, friendlyError, logout, watchUser } from './services/firebase';

function Catalog({ onAdd }) {
  const [category, setCategory] = useState('Todo');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('featured');
  const filtered = products.filter(p => (category === 'Todo' || p.category === category) && `${p.name} ${p.color}`.toLocaleLowerCase('es').includes(search.toLocaleLowerCase('es'))).sort((a, b) => sort === 'low' ? a.price - b.price : sort === 'high' ? b.price - a.price : 0);
  return <><section className="hero"><div className="hero-copy"><p className="eyebrow">Ropa y accesorios</p><h1>Menos vueltas.<br/>Más tú.</h1><p>Piezas cómodas, colores que combinan y espacio para tu propia forma de vestir.</p><a className="btn btn-dark btn-lg" href="#coleccion" onClick={e => { e.preventDefault(); document.getElementById('coleccion').scrollIntoView({ behavior: 'smooth' }); }}>Explorar colección</a><span className="hero-caption">Básicos para acompañar tu día.</span></div><div className="hero-art"><span className="collection-stamp">TRAMA<br/><small>LO ESENCIAL</small></span><ProductArt product={products[0]}/><div className="hero-small"><ProductArt product={products[1]}/></div><p>Una colección.<br/>Muchas formas de llevarla.</p></div></section><section id="coleccion" className="page-section"><div className="section-heading"><div><p className="eyebrow">Encuentra tu próximo favorito</p><h2>La colección</h2></div><span className="text-secondary">{filtered.length} productos</span></div><div className="catalog-toolbar"><div className="category-tabs" aria-label="Categoría">{['Todo', 'Ropa', 'Accesorios'].map(c => <button key={c} className={category === c ? 'active' : ''} aria-pressed={category === c} onClick={() => setCategory(c)}>{c}</button>)}</div><div className="d-flex gap-2 flex-wrap"><input className="form-control search" type="search" aria-label="Buscar producto" placeholder="Buscar en la colección" value={search} onChange={e => setSearch(e.target.value)}/><select className="form-select sort" aria-label="Ordenar productos" value={sort} onChange={e => setSort(e.target.value)}><option value="featured">Destacados</option><option value="low">Menor precio</option><option value="high">Mayor precio</option></select></div></div><div className="row g-4 g-lg-5">{filtered.map(product => <div className="col-sm-6 col-lg-4" key={product.id}><ProductCard product={product} onAdd={onAdd}/></div>)}</div>{!filtered.length && <p className="py-5">No encontramos productos. Prueba otra búsqueda o categoría.</p>}</section></>;
}
function Detail({ onAdd }) {
  const { id } = useParams();
  const product = products.find(p => p.id === id);
  const [size, setSize] = useState('');
  useEffect(() => setSize(''), [id]);
  if (!product) return <NotFound/>;
  return <section className="page-section"><Link to="/" className="text-secondary">Volver a la colección</Link><div className="row align-items-center g-5 mt-1"><div className="col-md-6"><ProductArt product={product}/></div><div className="col-md-6 detail"><p className="eyebrow">{product.category} · {product.color}</p><h1>{product.name}</h1><p className="fs-4">{money(product.price)}</p><p>{product.description}</p><label htmlFor="size" className="form-label mt-3">Talla</label><select id="size" className="form-select mb-4" value={size || product.sizes[0]} onChange={e => setSize(e.target.value)}>{product.sizes.map(s => <option key={s}>{s}</option>)}</select><button className="btn btn-dark btn-lg w-100" onClick={() => onAdd(product, size || product.sizes[0])}>Agregar a mi bolsa</button><p className="small text-secondary mt-3">Precios de ejemplo en pesos chilenos. Entrega a coordinar.</p></div></div></section>;
}
function Cart({ cart, onQuantity, onRemove }) {
  return <section className="page-section"><p className="eyebrow">Tus favoritos, juntos</p><h1>Mi bolsa</h1>{!cart.length ? <><p className="mt-4">Todavía no agregas productos.</p><Link className="btn btn-dark" to="/">Ver colección</Link></> : <div className="row g-5 mt-1"><div className="col-lg-8">{cart.map(item => { const p = products.find(p => p.id === item.productId); return <article className="cart-item" key={item.key}><Link to={`/producto/${p.id}`}><ProductArt product={p}/></Link><div className="flex-grow-1"><h2 className="h5">{p.name}</h2><p className="text-secondary mb-2">{p.color} · Talla {item.size}</p><div className="d-flex align-items-center gap-3 flex-wrap"><div className="quantity"><button aria-label={`Disminuir ${p.name}, talla ${item.size}`} disabled={item.quantity === 1} onClick={() => onQuantity(item.key, -1)}>−</button><span>{item.quantity}</span><button aria-label={`Aumentar ${p.name}, talla ${item.size}`} disabled={item.quantity === 20} onClick={() => onQuantity(item.key, 1)}>+</button></div><button className="remove-button" onClick={() => onRemove(item.key)}>Eliminar</button></div></div><strong>{money(p.price * item.quantity)}</strong></article>; })}</div><aside className="col-lg-4"><div className="order-summary"><h2>Resumen</h2><div className="summary-row"><span>Productos</span><strong>{money(total(cart))}</strong></div><p className="text-secondary small">El costo de entrega se coordina por separado.</p><Link to="/pedido" className="btn btn-dark w-100">Continuar al pedido</Link></div></aside></div>}</section>;
}
function Account({ user, authLoading }) {
  const [register, setRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(e) { e.preventDefault(); setBusy(true); setError(''); try { await authenticate(email.trim(), password, register); setPassword(''); } catch (e) { setError(friendlyError(e)); } finally { setBusy(false); } }
  if (authLoading) return <p className="page-section" role="status">Cargando sesión…</p>;
  if (user) return <section className="narrow page-section"><h1>Tu cuenta</h1><p className="mt-3">Sesión iniciada como {user.email}</p><Link className="btn btn-dark me-3" to="/pedido">Continuar pedido</Link><button className="btn btn-outline-dark" onClick={async () => { try { await logout(); } catch (e) { setError(friendlyError(e)); } }}>Cerrar sesión</button>{error && <p role="alert" className="text-danger mt-3">{error}</p>}</section>;
  return <section className="narrow page-section"><p className="eyebrow">Tu espacio en Trama</p><h1>{register ? 'Crea tu cuenta' : 'Qué bueno verte'}</h1><p className="text-secondary">Ingresa para enviar tu pedido y asociarlo a tu cuenta.</p>{!firebaseEnabled && <p className="notice">Modo demostración. El acceso estará disponible cuando configures Firebase.</p>}<form onSubmit={submit}><div className="mb-3"><label htmlFor="login-email" className="form-label">Correo electrónico</label><input id="login-email" type="email" className="form-control" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)}/></div><div className="mb-4"><label htmlFor="password" className="form-label">Contraseña</label><input id="password" type="password" className="form-control" autoComplete={register ? 'new-password' : 'current-password'} minLength="6" required value={password} onChange={e => setPassword(e.target.value)}/><small className="text-secondary">Al menos 6 caracteres.</small></div>{error && <p className="text-danger" role="alert">{error}</p>}<button className="btn btn-dark w-100" disabled={busy || !firebaseEnabled}>{busy ? 'Conectando…' : register ? 'Crear cuenta' : 'Iniciar sesión'}</button></form><button className="btn btn-link text-dark mt-3 px-0" onClick={() => { setRegister(!register); setError(''); }}>{register ? 'Ya tengo cuenta' : 'Quiero crear una cuenta'}</button></section>;
}
function NotFound() { return <section className="page-section"><h1>No encontramos esta página</h1><Link to="/">Volver al catálogo</Link></section>; }

// Padre de clase: mantiene el carrito y actualiza el estado mediante this.setState.
export default class App extends Component {
  constructor(props) {
    super(props);
    let cart = [];
    try { cart = hydrateCart(JSON.parse(localStorage.getItem('trama-cart') || '[]')); } catch { /* almacenamiento no disponible o datos corruptos */ }
    this.state = { cart, user: null, authLoading: firebaseEnabled, notice: '' };
  }
  componentDidMount() { this.unsubscribe = watchUser(user => this.setState({ user, authLoading: false })); }
  componentDidUpdate(_, previous) { if (previous.cart !== this.state.cart) { try { localStorage.setItem('trama-cart', JSON.stringify(this.state.cart)); } catch { /* el carrito sigue disponible durante esta sesión */ } } }
  componentWillUnmount() { this.unsubscribe?.(); clearTimeout(this.timer); }
  add = (product, size) => {
    this.setState(state => { const capped = state.cart.some(i => i.key === `${product.id}:${size}` && i.quantity >= 20); return { cart: addItem(state.cart, product, size), notice: capped ? 'Máximo 20 unidades por producto y talla.' : `${product.name} · talla ${size} agregado a tu bolsa.` }; });
    clearTimeout(this.timer); this.timer = setTimeout(() => this.setState({ notice: '' }), 4000);
  };
  quantity = (key, delta) => this.setState(state => ({ cart: state.cart.map(item => item.key === key ? { ...item, quantity: Math.max(1, Math.min(20, item.quantity + delta)) } : item) }));
  remove = key => this.setState(state => ({ cart: state.cart.filter(item => item.key !== key) }));
  render() {
    const { cart, user, authLoading, notice } = this.state;
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    return <HashRouter><a href="#main" className="skip-link" onClick={event => { event.preventDefault(); document.getElementById('main').focus(); }}>Saltar al contenido</a><div className="announcement">{emulatorEnabled ? 'Proyecto académico · Firebase local con emuladores' : firebaseEnabled ? 'Proyecto académico · Pedidos sin cobros en línea' : 'Proyecto académico · Modo demostración sin conexión a Firebase'}</div><header className="site-header"><div className="shell d-flex align-items-center justify-content-between gap-3"><Link className="wordmark" to="/" aria-label="Trama inicio">trama<span>®</span></Link><nav aria-label="Navegación principal"><NavLink to="/" end>Colección</NavLink><NavLink to="/cuenta">{user ? 'Mi cuenta' : 'Ingresar'}</NavLink><NavLink to="/bolsa" className="bag-link">Bolsa <span>{count}</span></NavLink></nav></div></header><main id="main" className="shell" tabIndex={-1}><Routes><Route path="/" element={<Catalog onAdd={this.add}/>}/><Route path="/producto/:id" element={<Detail onAdd={this.add}/>}/><Route path="/bolsa" element={<Cart cart={cart} onQuantity={this.quantity} onRemove={this.remove}/>}/><Route path="/pedido" element={<Checkout cart={cart} user={user} onComplete={() => this.setState({ cart: [] })}/>}/><Route path="/cuenta" element={<Account user={user} authLoading={authLoading}/>}/><Route path="*" element={<NotFound/>}/></Routes></main><div className={`toast-message ${notice ? 'visible' : ''}`} role="status" aria-live="polite">{notice}</div><footer className="site-footer"><div className="shell d-flex justify-content-between gap-4 flex-wrap"><div><span className="wordmark">trama</span><p>Ropa para vivir a tu manera.</p></div><p>Proyecto de Programación de Componentes<br/><span className="small">Catálogo e ilustraciones de demostración.</span></p></div></footer></HashRouter>;
  }
}
