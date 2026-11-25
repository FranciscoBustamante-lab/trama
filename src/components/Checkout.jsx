import { Component } from 'react';
import SimpleReactValidator from 'simple-react-validator';
import { Link } from 'react-router-dom';
import { money, products } from '../data/products';
import { total } from '../cart';
import { firebaseEnabled, saveOrder, friendlyError } from '../services/firebase';
export default class Checkout extends Component {
  constructor(props) {
    super(props);
    this.state = { name: '', email: '', address: '', notes: '', consent: false, file: null, busy: false, error: '', receipt: null };
    this.validator = new SimpleReactValidator({ autoForceUpdate: this, className: 'validation-message', messages: { required: 'El campo :attribute es obligatorio.', email: 'Ingresa un correo válido.', min: 'El campo :attribute debe tener al menos :min caracteres.', max: 'El campo :attribute admite hasta :max caracteres.', accepted: 'Debes aceptar el uso de datos para gestionar tu pedido.' } });
  }
  change = event => this.setState({ [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value });
  submit = async event => {
    event.preventDefault();
    if (!this.validator.allValid()) { this.validator.showMessages(); this.forceUpdate(); return; }
    if (!this.props.cart.length || this.state.busy) return;
    this.setState({ busy: true, error: '' });
    const { name, email, address, notes, file } = this.state;
    const payload = { name: name.trim(), email: email.trim(), address: address.trim(), notes: notes.trim(), consent: true, items: this.props.cart.map(item => ({ ...item, name: products.find(p => p.id === item.productId).name, unitPrice: products.find(p => p.id === item.productId).price })), total: total(this.props.cart) };
    try {
      // La demostración no envía ni conserva datos personales.
      const id = firebaseEnabled ? await saveOrder(payload, file) : `DEMO-${Date.now().toString(36).toUpperCase()}`;
      this.setState({ receipt: { id, total: payload.total, demo: !firebaseEnabled }, busy: false });
      this.props.onComplete();
    } catch (error) { this.setState({ error: friendlyError(error), busy: false }); }
  };
  render() {
    const { cart, user } = this.props;
    const { receipt, busy } = this.state;
    if (receipt) return <section className="narrow page-section"><p className="eyebrow">{receipt.demo ? 'Demostración completada' : 'Pedido recibido'}</p><h1>Gracias por elegir Trama.</h1><p>{receipt.demo ? 'Esta fue una simulación. No se envió un pedido ni se guardaron tus datos.' : 'Tu pedido se guardó en Firestore. No se realizó ningún cobro.'}</p><p>Referencia: <strong>{receipt.id}</strong><br/>Total: {money(receipt.total)}</p><Link className="btn btn-dark" to="/">Volver al catálogo</Link></section>;
    if (!cart.length) return <section className="narrow page-section"><h1>Tu bolsa está vacía</h1><p>Elige algo del catálogo antes de finalizar tu pedido.</p><Link className="btn btn-dark" to="/">Explorar colección</Link></section>;
    return <section className="page-section"><p className="eyebrow">El último paso</p><h1>Completa tu pedido</h1><div className="row g-5 mt-1"><div className="col-lg-7">
      {!firebaseEnabled && <p className="notice">Modo demostración: puedes probar el formulario. Los datos y archivos no se envían.</p>}
      {firebaseEnabled && !user && <p className="notice">Necesitas <Link to="/cuenta">iniciar sesión</Link> para enviar tu pedido.</p>}
      <form onSubmit={this.submit} noValidate>
        { [['name', 'Nombre completo', 'text', 'required|min:3|max:100', 'name'], ['email', 'Correo electrónico', 'email', 'required|email|max:150', 'email'], ['address', 'Dirección de entrega', 'text', 'required|min:8|max:250', 'street-address']].map(([key, label, type, rules, autoComplete]) => <div className="mb-4" key={key}><label className="form-label" htmlFor={key}>{label}</label><input id={key} name={key} type={type} autoComplete={autoComplete} className="form-control" value={this.state[key]} onChange={this.change} disabled={busy} required aria-describedby={`${key}-error`}/><div id={`${key}-error`}>{this.validator.message(label, this.state[key].trim(), rules)}</div></div>) }
        <div className="mb-4"><label className="form-label" htmlFor="notes">Notas del pedido <span className="text-secondary">(opcional)</span></label><textarea id="notes" name="notes" className="form-control" rows="3" maxLength="1000" value={this.state.notes} onChange={this.change} disabled={busy}/></div>
        <div className="mb-4"><label className="form-label" htmlFor="attachment">Referencia o comprobante <span className="text-secondary">(opcional)</span></label><input id="attachment" type="file" className="form-control" accept="image/jpeg,image/png,application/pdf" disabled={busy} onChange={event => { const file = event.target.files[0]; if (file && (file.size > 5242880 || !['image/jpeg', 'image/png', 'application/pdf'].includes(file.type))) { event.target.value = ''; this.setState({ file: null, error: 'El archivo debe ser JPG, PNG o PDF de hasta 5 MB.' }); } else this.setState({ file: file || null, error: '' }); }}/><small className="text-secondary">JPG, PNG o PDF. Máximo 5 MB. No adjuntes datos bancarios.</small></div>
        <div className="form-check mb-3"><input id="consent" name="consent" type="checkbox" className="form-check-input" checked={this.state.consent} onChange={this.change} disabled={busy}/><label htmlFor="consent" className="form-check-label">Acepto que se utilicen estos datos para gestionar mi pedido.</label>{this.validator.message('consentimiento', this.state.consent, 'accepted')}</div>
        {this.state.error && <p role="alert" className="text-danger">{this.state.error}</p>}
        <button className="btn btn-dark btn-lg" disabled={busy || (firebaseEnabled && !user)}>{busy ? 'Enviando…' : firebaseEnabled ? 'Enviar pedido' : 'Simular pedido'}</button><p className="small text-secondary mt-3">Proyecto académico. Sin pasarela de pago ni cobros.</p>
      </form></div><aside className="col-lg-5"><div className="order-summary"><h2>Tu selección</h2>{cart.map(item => { const p = products.find(p => p.id === item.productId); return <div className="summary-row" key={item.key}><span>{p.name}<small className="d-block text-secondary">Talla {item.size} · {item.quantity} unidad(es)</small></span><strong>{money(p.price * item.quantity)}</strong></div>; })}<div className="summary-row"><span>Entrega</span><span>A coordinar</span></div><div className="summary-row fs-5"><strong>Total productos</strong><strong>{money(total(cart))}</strong></div></div></aside></div></section>;
  }
}
