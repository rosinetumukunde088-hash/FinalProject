import { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FiShoppingCart } from 'react-icons/fi';

export default function ImageCarousel({ images = [], name = 'Product' }) {
  const [current, setCurrent] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="pd-gallery-frame">
        <div className="pd-gallery-fallback">
          <FiShoppingCart className="text-emerald-300" size={56} />
        </div>
      </div>
    );
  }

  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));

  return (
    <div className="pd-gallery-frame">
      <img
        src={images[current]}
        alt={`${name} ${current + 1}`}
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
      <div className="pd-gallery-fallback" style={{ display: 'none' }}>
        <FiShoppingCart className="text-emerald-300" size={56} />
      </div>

      {images.length > 1 && (
        <>
          <button onClick={prev} className="pd-gallery-nav prev" title="Previous image">
            <FiChevronLeft size={18} />
          </button>
          <button onClick={next} className="pd-gallery-nav next" title="Next image">
            <FiChevronRight size={18} />
          </button>

          <div className="pd-gallery-dots">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`pd-gallery-dot ${i === current ? 'active' : ''}`}
                title={`Image ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
