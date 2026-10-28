'use client'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchActiveCategoryList } from '@/app/redux/categorySlice'
import { fetchActiveSubCategoryList } from '@/app/redux/subcategorySlice'
import { fetchActiveSubCategoryTypeList } from '@/app/redux/subcategoryTypeSlice'
import { fetchActiveSellerList } from '@/app/redux/sellerSlice'
import { fetchActiveSizeList } from '@/app/redux/sizeSlice'
import { fetchActiveConcernList } from '@/app/redux/concernSlice';
import { fetchActiveIngredientList } from '@/app/redux/ingredientSlice';
import { addProduct } from '@/app/redux/productSlice'
import { fetchActiveStepsList } from '@/app/redux/stepsSlice'
import { fetchActiveTypeOfProductList } from '@/app/redux/typeofProductSlice'
import Select from 'react-select'
import { toast } from 'react-toastify'
import AddFaqForm from '../main-product/faq/page'
import SimilarProduct from '../main-product/similar-product/page'
import { addProductImage } from '@/app/redux/productSlice'
import SkinInsight from '../main-product/skin-insight/page'
import ProductMetaTag from '../main-product/product-metaTag/page'
import { set } from 'react-hook-form'


const AddProduct = ({ onClose, productId }) => {
  const dispatch = useDispatch()
  const { categoryData } = useSelector((state) => state?.category ?? [])
  const { sellerData } = useSelector((state) => state?.sellers ?? [])
  const { sizeData } = useSelector((state) => state?.size ?? [])
  const { concernList } = useSelector((state) => state?.concern ?? []);
  const { IngredientList } = useSelector((state) => state?.ingredient ?? []);
  const { stepsList } = useSelector((state) => state.steps ?? {})
  const { typeofproductList } = useSelector((state) => state?.typeofProduct)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [subCategoryOptions, setSubCategoryOptions] = useState([])
  const [selectedSubCategory, setSelectedSubCategory] = useState(null)
  const [subCategoryTypeOptions, setSubCategoryTypeOptions] = useState([])
  const [selectedSubCategoryType, setSelectedSubCategoryType] = useState(null)
  const [selectedSeller, setSelectedSeller] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedConcernId, setSelectedConcern] = useState(null);
  const [selectedIngredientId, setSelectedIngredient] = useState(null);
  const [selectedstepsId, setSelectedsteps] = useState(null);
  const [selectedtypeofProductId, setSelectedtypeofProduct] = useState(null);
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [subTitle, setSubTitle] = useState('')
  const [adress, setAdress] = useState('')
  const [stock, setstock] = useState('')
  const [price, setprice] = useState('')
  const [discountPrice, setdiscountPrice] = useState('')
  const [rating, setrating] = useState('')
  const [noOfRating, setnoOfRating] = useState('')
  const [mrp, setMrp] = useState('')
  const [activeTab, setActiveTab] = useState('addProduct');
  const [isFaqTabEnabled, setIsFaqTabEnabled] = useState(false);
  const [isProductMetaTagEnabled, setIsProductMetaTagEnabled] = useState(false);
  const [isSimilarProductTabEnabled, setIsSimilarProductTabEnabled] = useState(false);
  const [isSkinInsightEnabled, setIsSkinInsightTabEnabled] = useState(false);
  const [newProductId, setNewProductId] = useState(null);
  const [isNewArrial, setIsNewArrival] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isRecommended, setIsRecommended] = useState(false);
  const [similarProductData, setSimilarProductData] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    dispatch(fetchActiveCategoryList())
    dispatch(fetchActiveSellerList())
    dispatch(fetchActiveSizeList())
    dispatch(fetchActiveConcernList());
    dispatch(fetchActiveIngredientList());
    dispatch(fetchActiveStepsList())
    dispatch(fetchActiveTypeOfProductList())
  }, [dispatch])

  const handleCategoryChange = (option) => {
    setSelectedCategory(option)
    setSelectedSubCategory(null)
    setSelectedSubCategoryType(null)
    setSubCategoryOptions([])
    setSubCategoryTypeOptions([])

    if (errors.selectedCategory) {
      setErrors((prevErrors) => ({ ...prevErrors, selectedCategory: '' }));
    }

    if (option) {
      dispatch(fetchActiveSubCategoryList(option.value)).then((response) => {
        if (response?.payload?.length > 0) {
          setSubCategoryOptions(
            response.payload.map((sub) => ({
              value: sub.subCategoryGUID,
              label: sub.name,
            })),
          )
        }
      })
    }
  }
  const handleSubCategoryChange = (option) => {
    setSelectedSubCategory(option)
    setSelectedSubCategoryType(null)
    setSubCategoryTypeOptions([])

    if (option) {
      dispatch(fetchActiveSubCategoryTypeList(option.value)).then(
        (response) => {
          if (response?.payload?.length > 0) {
            setSubCategoryTypeOptions(
              response.payload.map((sub) => ({
                value: sub.subCategoryTypeGUID,
                label: sub.name,
              })),
            )
          }
        },
      )
    }
  }

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const [errors, setErrors] = useState({})

const validateForm = () => {
    const newErrors = {}
    
    // Required field validations
    if (!selectedCategory) newErrors.selectedCategory = 'Category is required'
    if (!selectedSubCategory) newErrors.selectedSubCategory = 'Subcategory is required'
    if (!selectedSubCategoryType) newErrors.selectedSubCategoryType = 'SubcategoryType is required'
    if (!selectedSeller) newErrors.selectedSeller = 'Seller is required'
    if (!selectedstepsId) newErrors.selectedstepsId = 'Steps is required'
    if (!selectedtypeofProductId) newErrors.selectedtypeofProductId = 'Type Of Product is required'
    if (!selectedSize) newErrors.selectedSize = 'Size is required'
    if (!selectedConcernId) newErrors.selectedConcerId = 'Concern is required'
    if (!selectedIngredientId) newErrors.selectedIngredientId = 'Ingredient is required'
    
    // Basic field validations
    if (!title.trim()) newErrors.title = 'Title is required'
    if (!description.trim()) newErrors.description = 'Description is required'
    if (!subTitle.trim()) newErrors.subTitle = 'Subtitle is required'
    if(!adress.trim()) newErrors.adress = 'Address is required'
    if (!image) newErrors.image = 'Image is required'

    // Numeric validations
    if (!stock.trim()) {
      newErrors.stock = 'Stock is required'
    } else if (isNaN(stock) || parseInt(stock) < 0) {
      newErrors.stock = 'Stock must be a positive number'
    }

    if (!mrp.trim()) {
      newErrors.mrp = 'MRP is required'
    } else if (isNaN(mrp) || parseFloat(mrp) <= 0) {
      newErrors.mrp = 'MRP must be a positive number'
    }

    if (!price.trim()) {
      newErrors.price = 'Price is required'
    } else if (isNaN(price) || parseFloat(price) <= 0) {
      newErrors.price = 'Price must be a positive number'
    } else if (parseFloat(price) > parseFloat(mrp)) {
      newErrors.price = 'Price cannot be greater than MRP'
    }

    if (!rating.trim()) {
      newErrors.rating = 'Rating is required'
    } else if (isNaN(rating) || parseFloat(rating) < 0 || parseFloat(rating) > 5) {
      newErrors.rating = 'Rating must be between 0 and 5'
    }

    if (!noOfRating.trim()) {
      newErrors.noOfRating = 'Number of ratings is required'
    } else if (isNaN(noOfRating) || parseInt(noOfRating) < 0) {
      newErrors.noOfRating = 'Number of ratings must be a positive number'
    }

      if (!image) {
      newErrors.image = 'Image is required';
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleMrpChange = (e) => {
    const newMrp = e.target.value;
    setMrp(newMrp);
    
    // Clear MRP error
    if (errors.mrp) {
      setErrors((prev) => ({ ...prev, mrp: '' }));
    }
    
    // Calculate discount if price exists
    if (price && !isNaN(price) && !isNaN(newMrp)) {
      const calculatedDiscount = Math.max(0, parseFloat(newMrp) - parseFloat(price));
      setdiscountPrice(calculatedDiscount.toString());
    }
  };

  const handlePriceChange = (e) => {
    const newPrice = e.target.value;
    setprice(newPrice);
    
    // Clear price error
    if (errors.price) {
      setErrors((prev) => ({ ...prev, price: '' }));
    }
    
    // Calculate discount if MRP exists
    if (mrp && !isNaN(mrp) && !isNaN(newPrice)) {
      const calculatedDiscount = Math.max(0, parseFloat(mrp) - parseFloat(newPrice));
      setdiscountPrice(calculatedDiscount.toString());
      
      // Validate price against MRP
      if (parseFloat(newPrice) > parseFloat(mrp)) {
        setErrors((prev) => ({
          ...prev,
          price: 'Price cannot be greater than MRP'
        }));
      }
    }
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    const productData = {
      title,
      subTitle,
      adress,
      description,
      stock,
      price,
      discountPrice,
      rating,
      noOfRating,
      mrp,
      categoryId: selectedCategory.value,
      categoryName: selectedCategory.label,
      subCategoryId: selectedSubCategory.value,
      subCategoryName: selectedSubCategory.label,
      subCategoryTypeId: selectedSubCategoryType?.value || null,
      subCategoryTypeName: selectedSubCategoryType?.label,
      sellerId: selectedSeller.value,
      sellerName: selectedSeller.label,
      sizeId: selectedSize?.value || null,
      sizeName: selectedSize.label,
      concernId: selectedConcernId?.value || null,
      concernName: selectedConcernId.label,
      ingredientId: selectedIngredientId?.value || null,
      ingredientName: selectedIngredientId.label,
      stepsId: selectedstepsId?.value || null,
      stepsName: selectedstepsId.label,
      typeofProductId: selectedtypeofProductId?.value || null,
      typeOfProductName: selectedtypeofProductId.label,
      isNewArrial,
      isBestSeller,
      isRecommended,
      
    }
    try {
      const response = await dispatch(addProduct(productData)).unwrap();
      if (response.statusCode === 200) {
        toast.success(response.message);
        const productId = response.productId;
        setNewProductId(productId);
        setIsSimilarProductTabEnabled(true);
        setActiveTab('addSimilarProduct');
        setIsFaqTabEnabled(true);
        setIsSkinInsightTabEnabled(true);
        setIsProductMetaTagEnabled(true);
        setSimilarProductData(productData);

        const productImageData = {
          productId: productId,
          image
        };

        if (productImageData) {
          const imageResponse = await dispatch(addProductImage(productImageData)).unwrap();
        }
      } else if (response.statusCode === 417) {
        toast.warn(response.message);
      } else {
        toast.error(response.message);
      }

    } catch (error) {
      toast.error(error?.message || 'Failed to add product');
    }

  }

  const categoryOptions = categoryData?.map((category) => ({
    value: category.categoryId,
    label: category.name,
  }))

  const sellerOptions = sellerData?.map((seller) => ({
    value: seller.sellerId,
    label: seller.name,
  }))

  const stepsOptions = stepsList?.map(steps => ({
    value: steps.stepsId,
    label: steps.name
  }))

  const typeOfProductOptions = typeofproductList?.map(typeofproduct => ({
    value: typeofproduct.typeofProductId,
    label: typeofproduct.name
  }))


  const sizeOptions = sizeData?.map((size) => ({
    value: size.sizeId,
    label: size.name,
  }))

  const concernOptions = concernList?.map(concern => ({
    value: concern.concernId,
    label: concern.name
  }));

  const ingredientOptions = IngredientList?.map(ingredient => ({
    value: ingredient.ingredientId,
    label: ingredient.name
  }))


  return (
    <div className="p-4 mt-5 mb-6 bg-white rounded-lg shadow-md">
      <div className="flex mb-4 overflow-x-auto border-b border-slate-300 sm:overflow-x-hidden">
        <div
          className={`cursor-pointer px-4 py-2 text-sm font-medium transition-colors duration-300 whitespace-nowrap ${activeTab === 'addProduct'
            ? 'border-b-2 border-[#062c21] text-[#062c21]'
            : 'text-slate-600 hover:text-[#062c21]'
            }`}
          onClick={() => setActiveTab('addProduct')}
        >
          Add Product
        </div>

        {/* Add Specification Tab */}
        <div
          className={`cursor-pointer px-4 py-2 text-sm font-medium transition-colors duration-300 whitespace-nowrap ${activeTab === 'addSimilarProduct'
            ? 'border-b-2 border-[#062c21] text-[#062c21]'
            : isSimilarProductTabEnabled
              ? 'text-slate-600 hover:text-[#062c21]'
              : 'text-slate-400 cursor-not-allowed'
            }`}
          onClick={() => {
            if (isSimilarProductTabEnabled) {
              setActiveTab('addSimilarProduct');
            }
          }}
        >
          Add Similar Product
        </div>

        {/* Add FAQ Tab */}
        <div
          className={`cursor-pointer px-4 py-2 text-sm font-medium transition-colors duration-300 whitespace-nowrap ${activeTab === 'addFaq'
            ? 'border-b-2 border-[#062c21] text-[#062c21]'
            : isFaqTabEnabled
              ? 'text-slate-600 hover:text-[#062c21]'
              : 'text-slate-400 cursor-not-allowed'
            }`}
          onClick={() => {
            if (isFaqTabEnabled) {
              setActiveTab('addFaq');
            }
          }}
        >
          Add FAQ
        </div>

        <div
          className={`cursor-pointer px-4 py-2 text-sm font-medium transition-colors duration-300 whitespace-nowrap ${activeTab === 'addSkinInsight'
            ? 'border-b-2 border-[#062c21] text-[#062c21]'
            : isSkinInsightEnabled
              ? 'text-slate-600 hover:text-[#062c21]'
              : 'text-slate-400 cursor-not-allowed'
            }`}
          onClick={() => {
            if (isSkinInsightEnabled) {
              setActiveTab('addSkinInsight');
            }
          }}
        >
          Add SkinInsight
        </div>
        
         <div
          className={`cursor-pointer whitespace-nowrap px-4 py-2 text-sm font-medium transition-colors duration-300 ${activeTab === 'addProductMetaTag'
            ? 'border-b-2 border-[#062c21] text-[#062c21]'
            : isProductMetaTagEnabled
              ? 'text-slate-600 hover:text-[#062c21]'
              : 'text-slate-400 cursor-not-allowed'
            }`}
          onClick={() => {
            if (isProductMetaTagEnabled) {
              setActiveTab('addProductMetaTag');
            }
          }}
        >
          Add Product Meta Tag
        </div>
      </div>


      {activeTab === 'addProduct' ? (
        <div>
          <h3 className="mb-10 text-2xl font-bold text-center text-[#062c21]">Add Product</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium">Category</label>
              <Select options={categoryOptions} value={selectedCategory} onChange={handleCategoryChange} placeholder="Select Category" className="w-full mt-2" />
              {errors.selectedCategory && <p className="mt-1 text-sm text-rose-600">{errors.selectedCategory}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">
                Subcategory <span className="text-rose-600">*</span>
              </label>
              <Select
                options={subCategoryOptions}
                value={selectedSubCategory}
                onChange={(value) => {
                  handleSubCategoryChange(value)
                  if (errors.selectedSubCategory) {
                    setErrors((prev) => ({ ...prev, selectedSubCategory: '' }))
                  }
                }}
                placeholder="Select Subcategory"
                isDisabled={!selectedCategory}
                className="w-full mt-2"
              />
              {errors.selectedSubCategory && (
                <p className="text-xs text-rose-600">{errors.selectedSubCategory}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">
                Subcategory Type <span className="text-rose-600">*</span>
              </label>
              <Select
                options={subCategoryTypeOptions}
                value={selectedSubCategoryType}
                onChange={(value) => {
                  setSelectedSubCategoryType(value)
                  if (errors.selectedSubCategoryType) {
                    setErrors((prev) => ({ ...prev, selectedSubCategoryType: '' }))
                  }
                }}
                placeholder="Select Subcategory Type"
                isDisabled={!selectedSubCategory}
                className="w-full mt-2"
              />
              {errors.selectedSubCategoryType && (
                <p className="text-xs text-rose-600">
                  {errors.selectedSubCategoryType}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">
                Seller <span className="text-rose-600">*</span>
              </label>
              <Select
                options={sellerOptions}
                value={selectedSeller}
                onChange={(value) => {
                  setSelectedSeller(value)
                  if (errors.selectedSeller) {
                    setErrors((prev) => ({ ...prev, selectedSeller: '' }))
                  }
                }}
                placeholder="Select Seller"
                className="w-full mt-2"
              />
              {errors.selectedSeller && (
                <p className="text-xs text-rose-600">{errors.selectedSeller}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">
                Steps <span className="text-rose-600">*</span>
              </label>
              <Select
                options={stepsOptions}
                value={selectedstepsId}
                onChange={(value) => {
                  setSelectedsteps(value)
                  if (errors.selectedstepsId) {
                    setErrors((prev) => ({ ...prev, selectedstepsId: '' }))
                  }
                }}
                placeholder="Select Steps"
                className="w-full mt-2"
              />
              {errors.selectedstepsId && (
                <p className="text-xs text-rose-600">{errors.selectedstepsId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">
                Type Of Product <span className="text-rose-600">*</span>
              </label>
              <Select
                options={typeOfProductOptions}
                value={selectedtypeofProductId}
                onChange={(value) => {
                  setSelectedtypeofProduct(value)
                  if (errors.selectedtypeofProductId) {
                    setErrors((prev) => ({ ...prev, selectedtypeofProductId: '' }))
                  }
                }}
                placeholder="Select TypeofProduct"
                className="w-full mt-2"
              />
              {errors.selectedtypeofProductId && (
                <p className="text-xs text-rose-600">{errors.selectedtypeofProductId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">
                Size <span className="text-rose-600">*</span>
              </label>
              <Select
                options={sizeOptions}
                value={selectedSize}
                onChange={(value) => {
                  setSelectedSize(value)
                  if (errors.selectedSize) {
                    setErrors((prev) => ({ ...prev, selectedSize: '' }))
                  }
                }}
                placeholder="Select Size"
                className="w-full mt-2"
              />
              {errors.selectedSize && (
                <p className="text-xs text-rose-600">{errors.selectedSize}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">Concern</label>
              <Select options={concernOptions} value={selectedConcernId} onChange={setSelectedConcern} placeholder="Select Concern" className="w-full mt-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">Ingredient</label>
              <Select options={ingredientOptions} value={selectedIngredientId} onChange={setSelectedIngredient} placeholder="Select Ingredient" className="w-full mt-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Title <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  if (errors.title) {
                    setErrors((prev) => ({ ...prev, title: '' }))
                  }
                }}
                placeholder="Enter Title"
                className={`w-full px-3 py-2 mt-2 border rounded ${errors.title ? 'border-rose-500' : ''}`}
              />
              {errors.title && (
                <p className="text-xs text-rose-600">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">
                Subtitle <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                value={subTitle}
                onChange={(e) => {
                  setSubTitle(e.target.value)
                  if (errors.subTitle) {
                    setErrors((prev) => ({ ...prev, subTitle: '' }))
                  }
                }}
                placeholder="Enter Subtitle"
                className={`w-full px-3 py-2 mt-2 border rounded ${errors.subTitle ? 'border-rose-500' : ''}`}
              />
              {errors.subTitle && (
                <p className="text-xs text-rose-600">{errors.subTitle}</p>
              )}
            </div>

           <div>
            <label className="block text-sm font-medium">
              Address <span className="text-rose-600">*</span>
            </label>
            <input type="text"
            value={adress}
            onChange={(e) => {
              setAdress(e.target.value)
              if(errors.adress) {
                setErrors((prev) => ({ ...prev, adress: ''}))
              }
            }}
            placeholder="Enter Address"
             className={`w-full px-3 py-2 mt-2 border rounded ${errors.subTitle ? 'border-rose-500' : ''}`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Stock Quantity <span className="text-rose-600">*</span>
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => {
                  setstock(e.target.value)
                  if (errors.stock) {
                    setErrors((prev) => ({ ...prev, stock: '' }))
                  }
                }}
                placeholder="Stock Quantity"
                className={`w-full px-3 py-2 mt-2 border rounded ${errors.stock ? 'border-rose-500' : ''}`}
              />
              {errors.stock && (
                <p className="text-xs text-rose-600">{errors.stock}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">
                MRP <span className="text-rose-600">*</span>
              </label>
              <input
                type="number"
                value={mrp}
                onChange={handleMrpChange}
                placeholder="MRP"
                className={`w-full px-3 py-2 mt-2 border rounded ${errors.mrp ? 'border-rose-500' : ''}`}
              />
              {errors.mrp && (
                <p className="text-xs text-rose-600">{errors.mrp}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">
                Price <span className="text-rose-600">*</span>
              </label>
              <input
                type="number"
                value={price}
                onChange={handlePriceChange}
                placeholder="Price"
                className={`w-full px-3 py-2 mt-2 border rounded ${errors.price ? 'border-rose-500' : ''}`}
              />
              {errors.price && (
                <p className="text-xs text-rose-600">{errors.price}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">
                Discount Price <span className="text-rose-600">*</span>
              </label>
              <input
                type="number"
                value={discountPrice}
                onChange={(e) => {
                  e.preventDefault();
                  return false;
                }}
                placeholder="Discount Price"
                className="w-full px-3 py-2 mt-2 border rounded"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Rating <span className="text-rose-600">*</span>
              </label>
              <input
                type="number"
                value={rating}
                onChange={(e) => {
                  setrating(e.target.value)
                  if (errors.rating) {
                    setErrors((prev) => ({ ...prev, rating: '' }))
                  }
                }}
                placeholder="Rating"
                className={`w-full px-3 py-2 mt-2 border rounded ${errors.rating ? 'border-rose-500' : ''}`}
              />
              {errors.rating && (
                <p className="text-xs text-rose-600">{errors.rating}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">
                No. of Ratings <span className="text-rose-600">*</span>
              </label>
              <input
                type="number"
                value={noOfRating}
                onChange={(e) => {
                  setnoOfRating(e.target.value)
                  if (errors.noOfRating) {
                    setErrors((prev) => ({ ...prev, noOfRating: '' }))
                  }
                }}
                placeholder="No. of Ratings"
                className={`w-full px-3 py-2 mt-2 border rounded ${errors.noOfRating ? 'border-rose-500' : ''}`}
              />
              {errors.noOfRating && (
                <p className="text-xs text-rose-600">{errors.noOfRating}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">
                Description <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value)
                  if (errors.description) {
                    setErrors((prev) => ({ ...prev, description: '' }))
                  }
                }}
                placeholder="Enter product description"
                className={`w-full px-3 py-2 mt-2 border rounded ${errors.description ? 'border-rose-500' : ''}`}
              />
              {errors.description && (
                <p className="text-xs text-rose-600">{errors.description}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">
                Choose Image <span className="text-rose-600">*</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full mt-2"
              />
              {errors.image && (

              <p className="mt-1 text-sm text-rose-600">{errors.image}</p> )}

            </div>
            <div className="flex flex-row justify-start gap-10 mt-4 md:col-span-3">

              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={isNewArrial}
                  onChange={(e) => setIsNewArrival(e.target.checked)}
                  className="w-5 h-5 mr-2 accent-[#062c21] border-slate-300 rounded focus:ring-[#062c21]"
                />

                <label className="text-sm font-medium">New project</label>
              </div>
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={isBestSeller}
                  onChange={(e) => setIsBestSeller(e.target.checked)}
                  className="w-5 h-5 mr-2 accent-[#062c21] border-slate-300 rounded focus:ring-[#062c21]"
                />
                <label className="text-sm font-medium">Best Seller</label>
              </div>
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={isRecommended}
                  onChange={(e) => setIsRecommended(e.target.checked)}
                  className="w-5 h-5 mr-2 accent-[#062c21] border-slate-300 rounded focus:ring-[#062c21]"
                />
                <label className="text-sm font-medium">Recommended</label>
              </div>
            </div>
          </div>
          <div>
          </div>
          <div className="flex justify-end gap-4 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-[#062c21] rounded-md bg-slate-200 hover:bg-slate-300 transition font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-amber-300 rounded-md bg-[#062c21] hover:bg-[#093d2e] transition font-semibold"
            >
              Submit
            </button>
          </div>
        </div>

      ) : activeTab === 'addSimilarProduct' && newProductId ? (
        <SimilarProduct 
          productId={newProductId} 
          data={similarProductData} 
          setActiveTab={setActiveTab} 
          onClose={onClose} 
        />
      ) : activeTab === 'addSkinInsight' && newProductId ? (
        <SkinInsight 
          productId={newProductId} 
          onClose={onClose} 
          setActiveTab={setActiveTab} 
        />
      ) : activeTab === 'addProductMetaTag' && newProductId ? (
        <ProductMetaTag 
          productId={newProductId} 
          setActiveTab={setActiveTab} 
          onClose={onClose} 
        />
      ) : activeTab === 'addFaq' && newProductId ? (
        <AddFaqForm 
          productId={newProductId} 
          setActiveTab={setActiveTab} 
        />
      ) : null}
    </div>
  )
}

export default AddProduct