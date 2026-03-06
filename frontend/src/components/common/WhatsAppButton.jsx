import WhatsAppIcon from './WhatsAppIcon';

const WhatsAppButton = () => {
    const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '541112345678';
    const message = 'Hola! Me gustaría hacer una consulta.';

    const handleClick = () => {
        const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <button
            onClick={handleClick}
            className="whatsapp-fab"
            style={{
                position: 'fixed',
                zIndex: 30,
                width: '48px',
                height: '48px',
                backgroundColor: '#22C55E',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(34,197,94,0.35)',
                transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.backgroundColor = '#16A34A';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.backgroundColor = '#22C55E';
            }}
            aria-label="Contactar por WhatsApp"
        >
            <WhatsAppIcon size={24} className="text-white fill-current" />
        </button>
    );
};

export default WhatsAppButton;
