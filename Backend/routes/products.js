import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import Product from '../models/Product.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tạo thư mục uploads nếu chưa tồn tại
const uploadsDir = path.join(__dirname, '..', 'uploads', 'products');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Cấu hình multer để lưu file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file ảnh!'), false);
    }
  }
});

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create product
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const productData = {
      productCode: req.body.productCode,
      productName: req.body.productName,
      orderDate: req.body.orderDate ? new Date(req.body.orderDate) : null,
      orderDateTo: req.body.orderDateTo ? new Date(req.body.orderDateTo) : null,
      receiveDate: req.body.receiveDate ? new Date(req.body.receiveDate) : null,
      receiveDateTo: req.body.receiveDateTo ? new Date(req.body.receiveDateTo) : null,
      status: req.body.status,
      quantity: parseInt(req.body.quantity) || 0,
      priceRMB: parseFloat(req.body.priceRMB) || 0,
      priceVND: parseFloat(req.body.priceVND) || 0,
      shippingCost: parseFloat(req.body.shippingCost) || 0,
      packagingCost: parseFloat(req.body.packagingCost) || 0,
      workshop: req.body.workshop || ''
    };

    if (req.file) {
      productData.imagePath = `/uploads/products/${req.file.filename}`;
    }

    const product = new Product(productData);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT update product (handles both FormData and JSON)
router.put('/:id', (req, res, next) => {
  // Check if request has JSON content-type, skip multer
  if (req.headers['content-type'] && req.headers['content-type'].includes('application/json')) {
    return next();
  }
  // Otherwise use multer for file uploads
  upload.single('image')(req, res, next);
}, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
    }

    // Xóa ảnh cũ nếu có ảnh mới
    if (req.file && product.imagePath) {
      const oldImagePath = path.join(__dirname, '..', product.imagePath);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    const updateData = {};
    
    // Handle JSON body (for warehouse updates, status updates) or FormData (for regular updates)
    if (req.body.productCode !== undefined) {
      updateData.productCode = req.body.productCode;
      updateData.productName = req.body.productName;
      updateData.orderDate = req.body.orderDate ? new Date(req.body.orderDate) : null;
      updateData.orderDateTo = req.body.orderDateTo ? new Date(req.body.orderDateTo) : null;
      updateData.receiveDate = req.body.receiveDate ? new Date(req.body.receiveDate) : null;
      updateData.receiveDateTo = req.body.receiveDateTo ? new Date(req.body.receiveDateTo) : null;
      updateData.status = req.body.status;
      updateData.quantity = parseInt(req.body.quantity) || 0;
      updateData.priceRMB = parseFloat(req.body.priceRMB) || 0;
      updateData.priceVND = parseFloat(req.body.priceVND) || 0;
      updateData.shippingCost = parseFloat(req.body.shippingCost) || 0;
      updateData.packagingCost = parseFloat(req.body.packagingCost) || 0;
      updateData.workshop = req.body.workshop || '';
    }
    
    // Handle status update separately (can be updated alone)
    if (req.body.status !== undefined && req.body.productCode === undefined) {
      updateData.status = req.body.status;
    }
    
    // Handle warehouse fields (can be updated separately)
    if (req.body.warehouseEntryDate !== undefined) {
      updateData.warehouseEntryDate = req.body.warehouseEntryDate ? new Date(req.body.warehouseEntryDate) : null;
    }
    if (req.body.warehouseQuantity !== undefined) {
      updateData.warehouseQuantity = parseInt(req.body.warehouseQuantity) || 0;
    }

    if (req.file) {
      updateData.imagePath = `/uploads/products/${req.file.filename}`;
    } else if (req.body.removeImage === 'true') {
      // Xóa ảnh nếu người dùng chọn xóa
      if (product.imagePath) {
        const oldImagePath = path.join(__dirname, '..', product.imagePath);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updateData.imagePath = null;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
    }

    // Xóa ảnh nếu có
    if (product.imagePath) {
      const imagePath = path.join(__dirname, '..', product.imagePath);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Đã xóa sản phẩm thành công' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

