const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Filtro de archivos (compartido)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('No es un archivo de imagen válido'), false);
    }
};

let storage;

if (process.env.CLOUDINARY_CLOUD_NAME) {
    // Producción: Cloudinary
    const cloudinary = require('cloudinary').v2;
    const cloudinaryStorage = require('multer-storage-cloudinary');

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    storage = cloudinaryStorage({
        cloudinary: cloudinary,
        folder: 'ecommerce-algo-diferente',
        allowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
        transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }]
    });

    console.log('[upload] Usando Cloudinary para almacenamiento de imágenes');
} else {
    // Local: disco
    const uploadDir = path.join(__dirname, '../../uploads');
    try {
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
    } catch (e) {
        console.warn('[upload] No se pudo crear el directorio de uploads:', e.message);
    }

    storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, uploadDir);
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + path.extname(file.originalname));
        }
    });

    console.log('[upload] Usando almacenamiento local en disco');
}

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

module.exports = upload;
