export default function ProductArt({ product, className = '' }) {
  const shapes = {
    shirt: <path d="M91 69 64 83 35 127 66 147 83 124 83 231 217 231 217 124 234 147 265 127 236 83 209 69 183 60Q150 89 117 60Z" />,
    bag: <><path d="M75 112H225L240 239H60Z"/><path d="M112 117V87C112 38 188 38 188 87V117" fill="none" strokeWidth="11"/></>,
    pants: <path d="M95 58H205L220 240H165L150 132 135 240H80Z"/>,
    hat: <><path d="M77 176V141C77 37 223 37 223 141V176Z"/><rect x="65" y="167" width="170" height="53" rx="12"/></>,
    scarf: <><path d="M98 55H157V232H98ZM157 55H202V200H157Z"/><path d="M106 232V250M120 232V250M136 232V250M164 200V219M180 200V219M195 200V219" fill="none" strokeWidth="5"/></>
  };
  return <div className={`product-art ${className}`} style={{ '--tone': product.tone }}><svg viewBox="0 0 300 300" role="img" aria-label={`${product.name}, color ${product.color}`}><ellipse cx="150" cy="259" rx="83" ry="10" fill="#000" opacity=".06"/><g fill={product.tone} stroke="#26392f" strokeOpacity=".22" strokeWidth="2" strokeLinejoin="round">{shapes[product.art]}</g></svg></div>;
}
