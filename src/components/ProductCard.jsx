import { Link } from 'react-router-dom';
import { money } from '../data/products';
import ProductArt from './ProductArt';
// Hijo: recibe datos por props y comunica la acción al padre con un callback.
export default function ProductCard({ product, onAdd }) {
  return <article className="product-card"><Link to={`/producto/${product.id}`} className="art-link"><ProductArt product={product}/></Link><div className="d-flex justify-content-between align-items-start gap-2 pt-3"><div><p className="eyebrow mb-1">{product.category} · {product.color}</p><h3><Link to={`/producto/${product.id}`}>{product.name}</Link></h3></div><strong className="price">{money(product.price)}</strong></div><button className="btn btn-outline-dark w-100 mt-2" onClick={() => onAdd(product, product.sizes[0])}>Agregar · talla {product.sizes[0]}</button></article>;
}
