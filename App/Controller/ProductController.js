const ProductData = require('../Model/ProductModel');

// create product
const CreateProduct = async (req, res) => {
    let data = new ProductData(req.body);
    try {
        const saveProduct = await data.save();
        res.status(200).send({ message: "Product added successfully", saveProduct });
    } catch (err) {
        res.status(500).send({ message: 'Cannot add Product', err });
    }
};

// get product with paginated api, search, category
const GetAllProducts = async (req, res) => {
    try {
        const { search, subCategory } = req.query;

        const page = req.query.page || 1;
        const limit = req.query.limit || 10;

        const query = {};

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        if (subCategory) {
            query.subCategoryId = subCategory;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const products = await ProductData.find(query)
            .skip(skip)
            .limit(parseInt(limit))
            .populate('subCategoryId');

        const total = await ProductData.countDocuments(query);

        res.status(200).send({
            message: "Products fetched successfully",
            data: products,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).send({ message: 'Cannot fetch products', error });
    }
};

// update product 
const EditProduct = async (req, res) => {
    try {
        const updateProduct = await ProductData.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (updateProduct) {
            res.status(200).send({ message: "Product updated successfully", updateProduct });
        } else {
            res.status(400).send({ message: "Product not found" });
        }
    } catch (err) {
        res.status(500).send({ message: 'Cannot update Product', err });
    }
};

// get product by id
const GetProductById = async (req, res) => {
    try {
        const ProductById = await ProductData.findById(req.params.id).populate('subCategoryId', 'name');
        if (ProductById) {
            res.status(200).send({ message: "Product fetch successfully", data: ProductById });
        } else {
            res.status(400).send({ message: "No Product found" });
        }
    } catch (error) {
        res.status(500).send({ message: 'Cannot fetch product', error });
    }
};

// delete product
const DeleteProduct = async (req, res) => {
    try {
        const deletedProduct = await ProductData.findByIdAndDelete(req.params.id);
        
        if (deletedProduct) {
            res.status(200).send({ message: "Product deleted successfully" });
        } else {
            res.status(400).send({ message: "Product not found" });
        }
    } catch (err) {
        res.status(500).send({ message: 'Cannot delete Product', err });
    }
};

module.exports = { CreateProduct, GetAllProducts, EditProduct, GetProductById, DeleteProduct };