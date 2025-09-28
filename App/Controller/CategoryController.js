const CategoryData = require('../Model/CategoryModel');

// Create category
const CreateCategory = async (req, res) => {
    let data = new CategoryData(req.body);
    try {
        const savedCategory = await data.save();
        res.status(200).send({ message: "Category added successfully", savedCategory });
    } catch (err) {
        res.status(500).send({ message: 'Cannot add Category', err });
    }
};

// Get all categories
const GetAllCategories = async (req, res) => {
    try {
        const categories = await CategoryData.find();
        res.status(200).send({ 
            message: "Categories fetched successfully", 
            data: categories 
        });
    } catch (error) {
        res.status(500).send({ message: 'Cannot fetch categories', error });
    }
};

// Get category by id
const GetCategoryById = async (req, res) => {
    try {
        const category = await CategoryData.findById(req.params.id);
        if (category) {
            res.status(200).send({ message: "Category fetched successfully", data: category });
        } else {
            res.status(400).send({ message: "No Category found" });
        }
    } catch (error) {
        res.status(500).send({ message: 'Cannot fetch category', error });
    }
};

// Update category
const EditCategory = async (req, res) => {
    try {
        const updatedCategory = await CategoryData.findByIdAndUpdate(req.params.id, req.body, { new: true });
        
        if (updatedCategory) {
            res.status(200).send({ message: "Category updated successfully", updatedCategory });
        } else {
            res.status(400).send({ message: "Category not found" });
        }
    } catch (err) {
        res.status(500).send({ message: 'Cannot update Category', err });
    }
};

// Delete category
const DeleteCategory = async (req, res) => {
    try {
        const deletedCategory = await CategoryData.findByIdAndDelete(req.params.id);
        
        if (deletedCategory) {
            res.status(200).send({ message: "Category deleted successfully" });
        } else {
            res.status(400).send({ message: "Category not found" });
        }
    } catch (err) {
        res.status(500).send({ message: 'Cannot delete Category', err });
    }
};

module.exports = { CreateCategory, GetAllCategories, GetCategoryById, EditCategory, DeleteCategory };