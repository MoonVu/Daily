import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  productCode: {
    type: String,
    required: true,
    trim: true
  },
  productName: {
    type: String,
    required: true,
    trim: true
  },
  orderDate: {
    type: Date
  },
  orderDateTo: {
    type: Date
  },
  receiveDate: {
    type: Date
  },
  receiveDateTo: {
    type: Date
  },
  status: {
    type: String,
    required: true,
    enum: ['waiting', 'received', 'ordered', 'sampling']
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  warehouseEntryDate: {
    type: Date
  },
  warehouseQuantity: {
    type: Number,
    min: 0,
    default: 0
  },
  imagePath: {
    type: String
  },
  priceRMB: {
    type: Number,
    min: 0,
    default: 0
  },
  priceVND: {
    type: Number,
    min: 0,
    default: 0
  },
  shippingCost: {
    type: Number,
    min: 0,
    default: 0
  },
  packagingCost: {
    type: Number,
    min: 0,
    default: 0
  },
  workshop: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Product', productSchema);

