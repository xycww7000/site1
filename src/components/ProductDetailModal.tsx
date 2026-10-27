import React, { useState } from 'react';
import { Product } from '../data/products';
import { X, Check, Truck, ShieldCheck, Ruler, ArrowRight, Minus, Plus, Share2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onOpenSizeGuide: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onOpenSizeGuide,
}) => {
  if (!product) return null;

  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedFit, setSelectedFit] = useState(product.fits[0] || 'Regular fit');
  const [selectedSize, setSelectedSize] = useState(product.sizes[1] || product.sizes[0] || 'M');
  const [quantity, setQuantity] = useState(1);
  const [cep, setCep] = useState('');
  const [shippingCalculated, setShippingCalculated] = useState(false);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'desc' | 'cuidados' | 'envio'>('desc');
  const [addedSuccess, setAddedSuccess] = useState(false);

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 8) val = val.slice(0, 8);
    if (val.length > 5) {
      val = val.slice(0, 5) + '-' + val.slice(5);
    }
    setCep(val);
  };

  const calculateShipping = (e: React.FormEvent) => {
    e.preventDefault();
    if (cep.replace(/\D/g, '').length === 8) {
      setShippingLoading(true);
      setTimeout(() => {
        setShippingLoading(false);
        setShippingCalculated(true);
      }, 600);
    }
  };

  const handleAddToCart = () => {
    addItem(product, selectedFit, selectedSize, quantity);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 900);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${product.name} | cia4w`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-5xl bg-black border border-white/20 text-white shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Modal Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 text-zinc-400 hover:text-white bg-black/80 hover:bg-zinc-900 border border-white/20 rounded-full transition-colors"
          aria-label="Fechar detalhes"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT COLUMN: Gallery */}
        <div className="w-full md:w-1/2 p-4 sm:p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10 bg-zinc-950/60 overflow-y-auto">
          {/* Main Selected Image */}
          <div className="relative w-full pb-[115%] bg-black border border-white/10 overflow-hidden mb-4">
            <img
              src={product.images[selectedImage] || product.images[0]}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-300"
            />
            {product.badge && (
              <span className="absolute top-3 left-3 bg-white text-black text-[10px] uppercase font-mono font-bold px-2 py-0.5 tracking-wider">
                {product.badge}
              </span>
            )}
          </div>

          {/* Thumbnails row */}
          {product.images.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative flex-shrink-0 w-16 h-20 border transition-all ${
                    selectedImage === idx
                      ? 'border-white opacity-100 ring-1 ring-white'
                      : 'border-white/20 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumb ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {img.includes('medidas') && (
                    <span className="absolute bottom-0 inset-x-0 bg-black/90 text-[8px] font-mono uppercase text-center py-0.5 text-zinc-300">
                      Medidas
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Details & Options */}
        <div className="w-full md:w-1/2 p-5 sm:p-7 overflow-y-auto max-h-[85vh] flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            {/* Breadcrumb & Category */}
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400 uppercase tracking-widest border-b border-white/10 pb-3">
              <span>cia4w / {product.category}</span>
              <button
                onClick={handleShare}
                className="hover:text-white flex items-center gap-1 transition-colors"
                title="Compartilhar"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="text-[10px]">Compartilhar</span>
              </button>
            </div>

            {/* Product Title & Price */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-normal text-white font-heading tracking-wide">
                {product.name}
              </h1>
              <div className="mt-2 flex items-baseline gap-3">
                <span className="text-2xl font-mono font-medium text-white">
                  R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
                  Frete Grátis
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono mt-1">
                ou {product.installments}
              </p>
            </div>

            {/* Production Notice Alert Box */}
            <div className="bg-zinc-950 border border-white/20 p-3 rounded text-xs font-mono text-zinc-300 space-y-1">
              <div className="flex items-center gap-2 text-white font-semibold">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span>{product.details.productionTime}</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Produção artesanal limitada. Todas as peças passam por acabamento manual exclusivo cia4w.
              </p>
            </div>

            {/* Fit Selection (Modelagem) */}
            {product.fits.length > 1 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                    Modelagem: <strong className="text-white">{selectedFit}</strong>
                  </span>
                  <button
                    onClick={onOpenSizeGuide}
                    className="text-[11px] font-mono text-zinc-400 hover:text-white underline flex items-center gap-1"
                  >
                    <Ruler className="w-3 h-3" />
                    <span>Tabela de medidas</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.fits.map((fit) => (
                    <button
                      key={fit}
                      onClick={() => setSelectedFit(fit)}
                      className={`px-3 py-1.5 text-xs font-mono transition-all border ${
                        selectedFit === fit
                          ? 'bg-white text-black font-semibold border-white shadow-sm'
                          : 'bg-black text-zinc-300 border-white/20 hover:border-white/50'
                      }`}
                    >
                      {fit}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection (Tamanho) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                  Tamanho: <strong className="text-white">{selectedSize}</strong>
                </span>
                {product.fits.length === 1 && (
                  <button
                    onClick={onOpenSizeGuide}
                    className="text-[11px] font-mono text-zinc-400 hover:text-white underline flex items-center gap-1"
                  >
                    <Ruler className="w-3 h-3" />
                    <span>Guia de tamanhos</span>
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[44px] h-10 px-3 flex items-center justify-center text-xs font-mono transition-all border ${
                      selectedSize === size
                        ? 'bg-white text-black font-bold border-white shadow-sm'
                        : 'bg-black text-zinc-300 border-white/20 hover:border-white/50'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Buy Button */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              {/* Quantity Selector */}
              <div className="flex items-center border border-white/30 w-32 justify-between bg-black">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2.5 text-zinc-400 hover:text-white transition-colors"
                  aria-label="Diminuir quantidade"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-sm px-2 text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2.5 text-zinc-400 hover:text-white transition-colors"
                  aria-label="Aumentar quantidade"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Main Action Button */}
              <button
                onClick={handleAddToCart}
                disabled={addedSuccess}
                className="flex-1 py-3.5 px-6 bg-white hover:bg-zinc-200 text-black font-mono font-bold text-xs uppercase tracking-widest border border-white transition-all active:scale-98 flex items-center justify-center gap-2 shadow-lg"
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Adicionado ao Carrinho!</span>
                  </>
                ) : (
                  <>
                    <span>Adicionar ao Carrinho</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Shipping Calculator (Meios de Envio) */}
            <div className="border border-white/10 p-4 bg-zinc-950/70 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-zinc-300">
                <Truck className="w-4 h-4 text-zinc-400" />
                <span>Calcular frete e prazo de entrega</span>
              </div>
              <form onSubmit={calculateShipping} className="flex gap-2">
                <input
                  type="text"
                  placeholder="00000-000"
                  value={cep}
                  onChange={handleCepChange}
                  className="flex-1 bg-black border border-white/20 px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-white transition-colors"
                />
                <button
                  type="submit"
                  disabled={shippingLoading || cep.replace(/\D/g, '').length !== 8}
                  className="px-4 py-2 bg-zinc-800 hover:bg-white hover:text-black text-white text-xs font-mono uppercase tracking-wider border border-white/20 transition-colors disabled:opacity-50"
                >
                  {shippingLoading ? 'Calculando...' : 'Calcular'}
                </button>
              </form>

              {shippingCalculated && (
                <div className="text-xs font-mono space-y-2 pt-2 border-t border-white/10 animate-in fade-in">
                  <div className="flex justify-between items-center text-zinc-300">
                    <div>
                      <span className="font-semibold text-white">SEDEX Express</span>
                      <p className="text-[10px] text-zinc-400">Entrega em até 3 dias úteis</p>
                    </div>
                    <span className="text-emerald-400 font-bold">GRÁTIS</span>
                  </div>
                  <div className="flex justify-between items-center text-zinc-300">
                    <div>
                      <span className="font-semibold text-white">PAC Convencional</span>
                      <p className="text-[10px] text-zinc-400">Entrega em 5 a 8 dias úteis</p>
                    </div>
                    <span className="text-emerald-400 font-bold">GRÁTIS</span>
                  </div>
                </div>
              )}
            </div>

            {/* Tabs / Product Information */}
            <div className="pt-2 border-t border-white/10">
              <div className="flex border-b border-white/10 text-xs font-mono uppercase tracking-wider">
                <button
                  onClick={() => setActiveTab('desc')}
                  className={`pb-2 px-3 border-b-2 transition-colors ${
                    activeTab === 'desc'
                      ? 'border-white text-white font-bold'
                      : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Descrição
                </button>
                <button
                  onClick={() => setActiveTab('cuidados')}
                  className={`pb-2 px-3 border-b-2 transition-colors ${
                    activeTab === 'cuidados'
                      ? 'border-white text-white font-bold'
                      : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Cuidados
                </button>
                <button
                  onClick={() => setActiveTab('envio')}
                  className={`pb-2 px-3 border-b-2 transition-colors ${
                    activeTab === 'envio'
                      ? 'border-white text-white font-bold'
                      : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Garantia
                </button>
              </div>

              <div className="pt-3 text-xs text-zinc-300 font-mono leading-relaxed">
                {activeTab === 'desc' && (
                  <div className="space-y-2 whitespace-pre-line">
                    {product.description}
                  </div>
                )}
                {activeTab === 'cuidados' && (
                  <ul className="space-y-1.5 list-disc list-inside text-zinc-300">
                    <li>Lavar à mão ou na máquina em ciclo delicado pelo avesso.</li>
                    <li>Não usar alvejantes ou cloro sob hipótese alguma.</li>
                    <li>Secar à sombra em varal (não utilizar secadora).</li>
                    <li>Não passar o ferro diretamente sobre as estampas, strass ou spikes.</li>
                  </ul>
                )}
                {activeTab === 'envio' && (
                  <div className="space-y-2 text-zinc-300">
                    <p>
                      <strong>Envio Seguro:</strong> Todos os pedidos são despachados com seguro total de transporte e código de rastreamento enviado via e-mail e WhatsApp.
                    </p>
                    <p>
                      <strong>Trocas e Devoluções:</strong> Prazo de até 7 dias corridos após o recebimento conforme o Código de Defesa do Consumidor.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-zinc-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-300" />
              Compra 100% Protegida
            </span>
            <span>cia4w Official Store</span>
          </div>
        </div>
      </div>
    </div>
  );
};
