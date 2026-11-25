export const products = [
  { id: 'camisa-lino', name: 'Camisa de lino', category: 'Ropa', price: 32990, sizes: ['S', 'M', 'L', 'XL'], color: 'Oliva', art: 'shirt', tone: '#b5b69b', description: 'Una camisa ligera de corte relajado, con cuello clásico y botones al frente.' },
  { id: 'bolso-diario', name: 'Bolso de todos los días', category: 'Accesorios', price: 24990, sizes: ['Única'], color: 'Caramelo', art: 'bag', tone: '#bd875d', description: 'Bolso amplio con asas largas, bolsillo interior y espacio para tus esenciales.' },
  { id: 'polera-esencial', name: 'Polera esencial', category: 'Ropa', price: 14990, sizes: ['S', 'M', 'L', 'XL'], color: 'Marfil', art: 'shirt', tone: '#e8e3d6', description: 'Polera de algodón de cuello redondo. Un básico cómodo para combinar a tu manera.' },
  { id: 'gorro-canalé', name: 'Gorro de canalé', category: 'Accesorios', price: 11990, sizes: ['Única'], color: 'Bosque', art: 'hat', tone: '#456955', description: 'Tejido suave y elástico con borde doblado, ideal para los días frescos.' },
  { id: 'pantalon-recto', name: 'Pantalón recto', category: 'Ropa', price: 38990, sizes: ['S', 'M', 'L', 'XL'], color: 'Pizarra', art: 'pants', tone: '#66737c', description: 'Pantalón de tiro medio, bolsillos laterales y una silueta recta fácil de llevar.' },
  { id: 'bufanda-suave', name: 'Bufanda suave', category: 'Accesorios', price: 18990, sizes: ['Única'], color: 'Terracota', art: 'scarf', tone: '#ba735c', description: 'Bufanda larga con terminación de flecos para sumar abrigo y color.' }
];
export const money = value => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(value);
