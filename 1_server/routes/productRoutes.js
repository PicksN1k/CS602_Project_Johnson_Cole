// File: routes/productRoutes.js

import express from 'express';

import * as productDB from '../productModule.js';

const router = express.Router();


// GET all products
router.get('/', async (req, res) => {

  try {

    const result = await productDB.getAllProducts();

    res.json(result);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Unable to retrieve products"
    });

  }

});


// GET products matching name or description
router.get('/name/:name', async (req, res) => {

  try {

    const name = req.params.name;

    const result = await productDB.lookupByName(name);

    res.json(result);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Unable to search products"
    });

  }

});


// GET products within a price range
router.get('/price/:min/:max', async (req, res) => {

  try {

    const min = Number(req.params.min);
    const max = Number(req.params.max);

    if (
      Number.isNaN(min) ||
      Number.isNaN(max) ||
      min < 0 ||
      max < 0 ||
      min > max
    ) {

      return res.status(400).json({
        error: "Invalid price range"
      });

    }

    const result = await productDB.lookupByPrice(min, max);

    res.json(result);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Unable to search products by price"
    });

  }

});


export default router;