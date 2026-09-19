import React, { useEffect, useState } from 'react'

function ImageGallery({ images = [], productName = '' }) {

    const [activeIdx, setActiveIdx] = useState(0)

    useEffect(() => {
        setActiveIdx(0)
    }, [images])

    const activeImage = images[activeIdx]

    return (
        <div>

            {/* Main Image */}
            <div
                className="position-relative overflow-hidden rounded-3 mb-3"
                style={{aspectRatio: '1 / 1', background: '#f5f5f5', maxHeight: 480}} >
                {activeImage?.url ? (
                    <img src={activeImage.url} alt={productName} className="w-100 h-100"
                        style={{objectFit: 'cover', transition: 'opacity 0.2s ease'}} />
                ) : (
                    <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                        <span style={{fontSize: 72, opacity: 0.3}} >
                            📦
                        </span>
                    </div>
                )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="d-flex gap-2 flex-wrap">
                    {images.map((img, index) => (
                        <button key={img.id || index} type="button" onClick={() => setActiveIdx(index)}
                            style={{width: 72, height: 72, borderRadius: 8, overflow: 'hidden',
                                border: index === activeIdx ? '2px solid #00b894' : '2px solid #e5e7eb',
                                padding: 0, background: '#f5f5f5', cursor: 'pointer', flexShrink: 0}} >
                            {img?.url && (
                                <img src={img.url} alt={`${productName} ${index + 1}`}
                                    style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                            )}
                        </button>
                    ))}
                </div>
            )}

        </div>
    )
}

export default ImageGallery