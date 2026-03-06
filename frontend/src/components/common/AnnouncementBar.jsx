import { useState, useEffect } from 'react';
import { X, Truck, CreditCard, Gift } from 'lucide-react';
import brandColors from '@utils/brandColors';

const announcements = [
    { icon: Truck, text: 'ENVÍO GRATIS en compras mayores a $50.000' },
    { icon: CreditCard, text: '3 CUOTAS SIN INTERÉS con todas las tarjetas' },
    { icon: Gift, text: 'DESCUENTOS EXCLUSIVOS — ¡Solo por tiempo limitado!' },
];

const AnnouncementBar = () => {
    const [visible, setVisible] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % announcements.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    if (!visible) return null;

    const current = announcements[currentIndex];
    const Icon = current.icon;

    return (
        <div
            style={{
                background: `linear-gradient(135deg, ${brandColors.cyan} 0%, ${brandColors.cyanDark} 100%)`,
                color: brandColors.black,
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '8px 40px 8px 16px',
                    minHeight: '36px',
                }}
            >
                <Icon style={{ width: '16px', height: '16px', flexShrink: 0 }} />
                <p
                    key={currentIndex}
                    style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        letterSpacing: '0.3px',
                        margin: 0,
                        textAlign: 'center',
                        animation: 'fadeInSlide 0.4s ease-out',
                    }}
                >
                    {current.text}
                </p>
            </div>

            <button
                onClick={() => setVisible(false)}
                style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(0,0,0,0.1)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: brandColors.black,
                    transition: 'background 0.2s',
                }}
                aria-label="Cerrar anuncio"
            >
                <X style={{ width: '14px', height: '14px' }} />
            </button>

            <style>{`
                @keyframes fadeInSlide {
                    from { opacity: 0; transform: translateY(6px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default AnnouncementBar;
