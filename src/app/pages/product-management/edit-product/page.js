'use client'
import React, { useState, useEffect } from 'react';
import { getProductList, updateProduct } from '@/app/redux/productSlice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActiveSellerList } from '@/app/redux/sellerSlice';
import { fetchActiveBrandList } from '@/app/redux/brandSlice';
import { fetchActiveColorList } from '@/app/redux/colorSlice';
import { fetchActiveSizeList } from '@/app/redux/sizeSlice';
import { fetchConcern } from '@/app/redux/concernSlice';
import { fetchIngredient } from '@/app/redux/ingredientSlice';
import { fetchActiveStepsList } from '@/app/redux/stepsSlice'
import { fetchActiveTypeOfProductList } from '@/app/redux/typeofProductSlice'
import { toast } from 'react-toastify';

const EditProduct = ({ product, onClose }) => {
    const { sellerData } = useSelector((state) => state.sellers);
    const { stepsList } = useSelector((state) => state.steps ?? {})
    const { typeofproductList } = useSelector((state) => state?.typeofProduct)
    const { sizeData } = useSelector((state) => state?.size ?? []);
    const { ConcernData } = useSelector((state) => state?.concern ?? []);
    const { IngredientData } = useSelector((state) => state?.ingredient ?? []);
    const data = useSelector((state) => state?.product ?? []);
    const dispatch = useDispatch();
    const [mrpError, setMrpError] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        category: '',
        subcategory: '',
        subcategoryTypeId: '',
        seller: '',
        typeOfProduct: '',
        steps: '',
        size: '',
        concern: '',
        ingredient: '',
        title: '',
        subTitle: '',
        adress: '',
        stock: '',
        price: '',
        mrp: '',
        discountPrice: '',
        rating: '',
        noOfRating: '',
        description: '',
        isNewArrial: false,
        isBestSeller: false,
        isRecommended: false,
        isActive: false,
    });

    useEffect(() => {
        if (product) {
            setFormData({
                category: product.categoryId || '',
                subcategory: product.subCategoryId || '',
                subCategoryTypeId: product.subCategoryTypeId || '',
                seller: product.sellerId || '',
                steps: product.stepsId || '',
                typeOfProduct: product.typeOfProductId || '',
                size: product.sizeId || '',
                concern: product.concernId || '',
                ingredient: product.ingredientId || '',
                title: product.productName || '',
                subTitle: product.subName || '',
                adress: product.adress || '',
                stock: product.stock || '',
                price: product.price || '',
                mrp: product.mrp || '',
                discountPrice: product.discountPrice || '',
                rating: product.rating || '',
                noOfRating: product.noOfRating || '',
                description: product.description || '',
                isNewArrial: product.isNewArrial,
                isBestSeller: product.isBestSeller,
                isRecommended: product.isRecommended,
                isActive: product.active,
            });
        }
        dispatch(fetchActiveSellerList());
        dispatch(fetchActiveBrandList());
        dispatch(fetchActiveColorList());
        dispatch(fetchActiveSizeList());
        dispatch(fetchConcern());
        dispatch(fetchIngredient());
        dispatch(fetchActiveStepsList())
        dispatch(fetchActiveTypeOfProductList())
    }, [product, dispatch]);

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setFormData((prevFormData) => {
            const newData = { ...prevFormData };
            newData[name] = type === "checkbox" ? checked : value;

            // Validate MRP and Price in real-time
            if (name === 'mrp' || name === 'price') {
                const mrp = parseFloat(newData.mrp) || 0;
                const price = parseFloat(newData.price) || 0;

                if (price > mrp) {
                    setMrpError(true);
                    setErrors({
                        ...errors,
                        price: 'Price cannot be greater than MRP'
                    });
                } else {
                    setMrpError(false);
                    setErrors({
                        ...errors,
                        price: ''
                    });
                }
                const discountPrice = mrp - price;
                newData.discountPrice = discountPrice.toString();
            }

            return newData;
        });
    };


    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: checked,
        }));
    };

    const updatedData = {
        productId: product?.productId,
        categoryId: product?.categoryId,
        subCategoryId: product?.subCategoryId,
        subCategoryTypeId: product?.subCategoryTypeId,
        sellerId: formData.seller,
        stepsId: formData.steps,
        typeofProductId: formData.typeOfProduct,
        sizeId: formData.size,
        concernId: formData.concern,
        ingredientId: formData.ingredient,
        title: formData.title,
        subTitle: formData.subTitle,
        adress: formData.adress,
        rating: formData.rating,
        noOfRating: formData.noOfRating,
        stock: formData.stock,
        price: formData.price,
        mrp: formData.mrp,
        discountPrice: formData.discountPrice,
        description: formData.description,
        isNewArrial: formData.isNewArrial,
        isBestSeller: formData.isBestSeller,
        isRecommended: formData.isRecommended,
        active: formData.isActive
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        let isValid = true;
        const newErrors = {};
        const mrp = parseFloat(formData.mrp) || 0;
        const price = parseFloat(formData.price) || 0;
        if (price > mrp) {
            newErrors.price = 'Price cannot be greater than MRP';
            isValid = false;
        }

        setErrors(newErrors);
        if (!isValid) return;

        dispatch(updateProduct(updatedData))
            .unwrap()
            .then((response) => {
                if (response.statusCode === 200) {
                    toast.success(response.message);
                } else {
                    toast.error(response.message);
                }
                dispatch(getProductList());
                onClose();
            })
            .catch((error) => {
                toast.error(error?.message || "Failed to update product");
            });
    };

    return (
        <div className="p-4 mb-4 rounded">
            <h3 className="mb-6 text-xl font-bold text-center text-[#062c21] md:text-2xl md:mb-10">Edit Product</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {/* Category */}
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-[#062c21]">Category</label>
                    <input
                        type="category"
                        name="category"
                        value={product?.categoryName}
                        disabled
                        className="w-full px-3 py-2 mt-2 text-sm bg-slate-100 border border-slate-300 rounded cursor-not-allowed md:text-base"
                    />
                </div>

                {/* Subcategory */}
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-[#062c21]">Subcategory</label>
                    <input
                        type="text"
                        name="subcategory"
                        value={product?.subCategoryName}
                        disabled
                        className="w-full px-3 py-2 mt-2 text-sm bg-slate-100 border border-slate-300 rounded cursor-not-allowed md:text-base"
                    />
                </div>

                {/* Subcategory Type */}
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-[#062c21]">Subcategory Type</label>
                    <input
                        type="text"
                        name="subCategoryTypeId"
                        value={product?.subCategoryTypeName}
                        disabled
                        className="w-full px-3 py-2 mt-2 text-sm bg-slate-100 border border-slate-300 rounded cursor-not-allowed md:text-base"
                    />
                </div>

                {/* Seller */}
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-[#062c21]">Seller</label>
                    <select
                        name="seller"
                        value={formData.seller}
                        onChange={handleChange}
                        className="w-full px-3 py-2 mt-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#062c21] md:text-base"
                    >
                        <option value="">Select Seller</option>
                        {sellerData.map((seller) => (
                            <option key={seller.sellerId} value={seller.sellerId}>
                                {seller.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Step */}
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-[#062c21]">Step</label>
                    <select
                        name="steps"
                        value={formData.steps}
                        onChange={handleChange}
                        className="w-full px-3 py-2 mt-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#062c21] md:text-base"
                    >
                        <option value="">Select steps</option>
                        {stepsList.map((steps) => (
                            <option key={steps.stepsId} value={steps.stepsId}>
                                {steps.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Type of Product */}
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-[#062c21]">Type of Product</label>
                    <select
                        name="typeOfProduct"
                        value={formData.typeOfProduct}
                        onChange={handleChange}
                        className="w-full px-3 py-2 mt-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#062c21] md:text-base"
                    >
                        <option value="">Select TypeofProduct</option>
                        {typeofproductList.map((typeOfProduct) => (
                            <option key={typeOfProduct.typeofProductId} value={typeOfProduct.typeofProductId}>
                                {typeOfProduct.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Size */}
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-[#062c21]">Size</label>
                    <select
                        name="size"
                        value={formData.size}
                        onChange={handleChange}
                        className="w-full px-3 py-2 mt-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#062c21] md:text-base"
                    >
                        <option value="">Select size</option>
                        {sizeData.map((size) => (
                            <option key={size.sizeId} value={size.sizeId}>
                                {size.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Concern */}
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-[#062c21]">Concern</label>
                    <select
                        name="concern"
                        value={formData.concern}
                        onChange={handleChange}
                        className="w-full px-3 py-2 mt-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#062c21] md:text-base"
                    >
                        <option value="">Select Concern</option>
                        {ConcernData.map((concern) => (
                            <option key={concern.concernId} value={concern.concernId}>
                                {concern.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Ingredient */}
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-[#062c21]">Ingredient</label>
                    <select
                        name="ingredient"
                        value={formData.ingredient}
                        onChange={handleChange}
                        className="w-full px-3 py-2 mt-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#062c21] md:text-base"
                    >
                        <option value="">Select Ingredient</option>
                        {IngredientData.map((ingredient) => (
                            <option key={ingredient.ingredientId} value={ingredient.ingredientId}>
                                {ingredient.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Title */}
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-[#062c21]">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full px-3 py-2 mt-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#062c21] md:text-base"
                    />
                </div>

                {/* Subtitle */}
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-[#062c21]">Subtitle</label>
                    <input
                        type="text"
                        name="subTitle"
                        value={formData.subTitle}
                        onChange={handleChange}
                        className="w-full px-3 py-2 mt-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#062c21] md:text-base"
                    />
                </div>
                 {/* Address */}
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-[#062c21]">Address</label>
                    <input
                        type="text"
                        name="adress"
                        value={formData.adress}
                        onChange={handleChange}
                        className="w-full px-3 py-2 mt-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#062c21] md:text-base"
                    />
                </div>




                {/* Stock Quantity */}
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-[#062c21]">Stock Quantity</label>
                    <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        className="w-full px-3 py-2 mt-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#062c21] md:text-base"
                    />
                </div>


                {/* MRP */}
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-[#062c21]">MRP</label>
                    <input
                        type="number"
                        name="mrp"
                        value={formData.mrp}
                        onChange={handleChange}
                        className="w-full px-3 py-2 mt-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#062c21] md:text-base"
                    />
                </div>

                {/* Price */}
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-[#062c21]">Price</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 mt-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-[#062c21] md:text-base ${errors.price ? 'border-rose-500' : 'border-slate-300'
                            }`}
                    />
                    {errors.price && (
                        <p className="mt-1 text-xs text-rose-600">{errors.price}</p>
                    )}
                </div>

                {/* Discount Price */}
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-[#062c21]">Discount Price</label>
                    <input
                        type="number"
                        name="discountPrice"
                        value={formData.discountPrice}
                        onChange={handleChange}
                        className="w-full px-3 py-2 mt-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#062c21] md:text-base"
                    />
                </div>

                {/* Rating */}
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-[#062c21]">Rating</label>
                    <input
                        type="text"
                        name="rating"
                        value={formData.rating}
                        onChange={handleChange}
                        className="w-full px-3 py-2 mt-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#062c21] md:text-base"
                    />
                </div>

                {/* No. of Ratings */}
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-[#062c21]">No. of Ratings</label>
                    <input
                        type="text"
                        name="noOfRating"
                        value={formData.noOfRating}
                        onChange={handleChange}
                        className="w-full px-3 py-2 mt-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#062c21] md:text-base"
                    />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[#062c21]">Description</label>
                    <input
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-3 py-2 mt-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#062c21] md:text-base"
                        rows="3"
                    />
                </div>

                {/* Active Checkbox */}
                <div className="col-span-1 mt-3 md:col-span-3">
                    <label className="flex items-center text-sm font-medium text-[#062c21]">
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleChange}
                            className="w-4 h-4 mr-2 accent-[#062c21]"
                        />
                        Active
                    </label>
                </div>

                {/* Checkbox Group */}
                <div className="flex flex-col col-span-1 mt-3 space-y-3 md:col-span-3 md:flex-row md:space-y-0 md:space-x-4">
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="isNewArrial"
                            checked={formData.isNewArrial}
                            onChange={handleCheckboxChange}
                            className="w-4 h-4 accent-[#062c21]"
                        />
                        <span className="text-sm md:text-base text-[#062c21]">New Project</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="isBestSeller"
                            checked={formData.isBestSeller}
                            onChange={handleCheckboxChange}
                            className="w-4 h-4 accent-[#062c21]"
                        />
                        <span className="text-sm md:text-base text-[#062c21]">Best Seller</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="isRecommended"
                            checked={formData.isRecommended}
                            onChange={handleCheckboxChange}
                            className="w-4 h-4 accent-[#062c21]"
                        />
                        <span className="text-sm md:text-base text-[#062c21]">Recommended</span>
                    </label>
                </div>

                {/* Buttons */}
                <div className="flex flex-col col-span-1 gap-3 mt-4 md:col-span-3 md:flex-row md:justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-[#062c21] rounded bg-slate-200 hover:bg-slate-300 transition font-medium md:text-base"
                    >
                        Close
                    </button>
                    <button
                        className="px-4 py-2 text-sm text-amber-300 rounded bg-[#062c21] hover:bg-[#093d2e] transition font-semibold md:text-base"
                        type="submit"
                        onClick={handleSubmit}
                    >
                        Update
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProduct;