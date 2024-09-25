import { Request, Response } from 'express';
import { ProductService } from '../services/ProductService';

export const createProduct = async (req: Request, res: Response) => {
  try {
    const file = req.file as Express.Multer.File | undefined;

    if (!file) {
      return res.status(400).json({ 
        status: 'error', 
        error: 'No image file uploaded' 
      });
    }

    const { name, category, price, description, serialNumber, brand, model, condition, yearOfManufacture, usageDuration, title, weight, height, city, postalCode, specificAddress, currency } = req.body;

    const missingFields = [];
    if (!serialNumber) missingFields.push('serialNumber');
    if (!name) missingFields.push('name');
    if (!category) missingFields.push('category');
    if (!price) missingFields.push('price');
    if (!description) missingFields.push('description');
    if (!brand) missingFields.push('brand');
    if (!model) missingFields.push('model');
    if (!condition) missingFields.push('condition');
    if (!yearOfManufacture) missingFields.push('yearOfManufacture');
    if (!usageDuration) missingFields.push('usageDuration');
    if (!title) missingFields.push('title');
    if (!weight) missingFields.push('weight');
    if (!height) missingFields.push('height');
    if (!city) missingFields.push('city');
    if (!postalCode) missingFields.push('postalCode');
    if (!specificAddress) missingFields.push('specificAddress');
    if (!currency) missingFields.push('currency');

    if (missingFields.length > 0) {
      return res.status(400).json({ 
        status: 'error', 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      });
    }

    // Upload ảnh từ buffer thay vì từ file path
    const imageUrl = await ProductService.uploadImageFromBuffer(file.buffer);
    
    const productData = {
      ...req.body,
      images: imageUrl, 
    };

    const newProduct = await ProductService.createProduct(productData);

    return res.status(201).json({
      status: 'success',
      message: 'Product created successfully',
      data: newProduct
    });

  } catch (error) {
    return res.status(500).json({ 
      status: 'error', 
      error: (error as Error).message 
    });
  }
};
