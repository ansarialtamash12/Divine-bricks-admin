"use client";
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table from '@/app/common/datatable';
import { addBanner, deleteBanner, getBanner, updateBanner } from '@/app/redux/bannersAdsSlice';
import { Columns } from '@/app/constants/bannerAds-constant';
import Select from 'react-select';
import { fetchActiveSubCategoryList } from '@/app/redux/subcategorySlice';
import { getCategory } from '@/app/redux/categorySlice';
import Image from "next/image";
import { toast } from 'react-toastify';
import DeletePopup from '@/app/common/utils/delete-popup';
import { limitToCharacters, validateRequiredField, validateRequiredSelect } from '@/app/common/utils/validationHelpers';

const Banner = () => {
  const dispatch = useDispatch();
  const { loading, bannerData = [] } = useSelector((state) => state.bannerAds ?? {});
  const { subCategoryData } = useSelector((state) => state.subCategory);
  const [showForm, setShowForm] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [image, setImage] = useState(null);
  const [tittle, setTittle] = useState('');
  const [subTittle, setSubTitle] = useState('');
  const [editBannerId, setEditBannerId] = useState(null);
  const [active, setActive] = useState(false);
  const [categoryId, setCategoryId] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false)
  const [bannerToDelete, setBannerToDelete] = useState(null)
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchActiveSubCategoryList());
    dispatch(getBanner());
    dispatch(getCategory());
  }, [dispatch]);

  const validateForm = () => {
    const newErrors = {};

    const titleError = validateRequiredField(tittle, "Banner Name");
    if (titleError) newErrors.tittle = titleError;

    const subTittleError = validateRequiredField(subTittle, "Sub Title");
    if (subTittleError) newErrors.subTittle = subTittleError;

    const subCategoryError = validateRequiredSelect(selectedSubCategory, "Sub Category");
    if (subCategoryError) newErrors.selectedSubCategory = subCategoryError;

    const imageError = validateRequiredField(image, "Image");
    if (imageError) newErrors.image = imageError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const subCategoryoptions = subCategoryData.map(subCategory => ({
    value: subCategory.subCategoryGUID,
    label: subCategory.name,
  }));

  const handleSubCategoryChange = (option) => {
    setSelectedSubCategory(option);

    if (errors.selectedSubCategory) {
      setErrors((prevErrors) => ({ ...prevErrors, selectedSubCategory: '' }));
    }
    const selectedSubCategoryData = subCategoryData.find(subCategory => subCategory.subCategoryGUID === option.value);
    setCategoryId(selectedSubCategoryData ? selectedSubCategoryData.categoryId : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formData = new FormData();

    formData.append('title', tittle);
    formData.append('subTitle', subTittle);

    formData.append('categoryId', categoryId);
    formData.append('subCategoryId', selectedSubCategory.value);
    formData.append('active', active);

    try {
      if (editMode) {
        formData.append('bannerId', editBannerId);

        // Only append new image if a new one is selected
        if (image && typeof image !== 'string') {
          formData.append('image', image);
        } else {
          formData.append('image', '');
        }

        const response = await dispatch(updateBanner(formData)).unwrap();
        if (response.statusCode === 200) {
          toast.success(response.message);
        } else {
          toast.error(response.message);
        }
      } else {
        formData.append('image', image);

        const response = await dispatch(addBanner(formData)).unwrap();
        if (response.statusCode === 200) {
          toast.success(response.message);
        } else if (response.statusCode === 417) {
          toast.warn(response.message);
        } else {
          toast.error(response.message);
        }
      }

      // Reset form
      setTittle('');
      setSubTitle('');
      setImage(null);
      setEditBannerId(null);
      setSelectedSubCategory(null);
      setActive(false);
      setEditMode(false);
      setShowForm(false);
      setErrors({})
      dispatch(getBanner());
    } catch (error) {
      console.error("Error:", error);
    }
  };


  const handleEdit = (banner) => {
    const subCategoryOption = subCategoryoptions.find(
      (opt) => opt.value === banner.subCategoryId
    );
    setErrors({});
    setSelectedSubCategory(subCategoryOption || null);
    setTittle(banner.title);
    setSubTitle(banner.subTitle);
    setActive(banner.active ?? false);
    setEditBannerId(banner.bannerId);
    setEditMode(true);
    setShowForm(true);
    setImage(banner.image);
  };

  const handleDeleteClick = (banner) => {
    setBannerToDelete(banner)
    setShowDeletePopup(true)
  }

  const handleDeleteConfirm = async () => {
    if (bannerToDelete) {
      try {
        const response = await dispatch(deleteBanner(bannerToDelete.bannerId)).unwrap()
        if (response.statusCode === 200) {
          toast.success(response.message);
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        console.error("Delete error:", error)
      }
      setShowDeletePopup(false)
      dispatch(getBanner())
    }
  };

  return (
    <div className="max-w-full pt-8 mx-auto mt-5 mb-6 bg-white rounded-lg">
      <div className='flex'>
        <div className='w-full md:w-[45%] flex justify-center md:justify-start'>
          {!showForm && (
            <button
              onClick={() => {
                setErrors({});
                setShowForm(true);
                setEditMode(false);
                setTittle('');
                setSubTitle('');
                setImage(null);
                setActive(false);
              }}
              className="px-4 py-2 mt-3 text-white rounded-md bg-add-btn">
              + Add Banner
            </button>
          )}
        </div>

      </div>


      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 ">
          <h2 className="mb-4 text-2xl font-bold text-center text-add-label">
            {editMode ? 'Edit Banner' : 'Add Banner'}
          </h2>
          <label className="block font-medium">Banner Name</label>
          <input
            type="text"
            placeholder="Banner Name"
            value={tittle}
            onChange={(e) => {
              const limitedValue = limitToCharacters(e.target.value);
              setTittle(limitedValue);
              if (errors.tittle) {
                setErrors((prevErrors) => ({ ...prevErrors, tittle: '' }));
              }
            }}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5E34]" />

          {errors.tittle && <p className="mt-1 text-sm text-red-500">{errors.tittle}</p>}
          <label className="block font-medium">Banner SubTitle</label>
          <input
            type="text"
            placeholder="Banner SubTitle"
            value={subTittle}
            onChange={(e) => {
              setSubTitle(e.target.value);
              if (errors.subTittle) {
                setErrors((prevErrors) => ({ ...prevErrors, subTittle: '' }));
              }
            }}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5E34]"
          />

          {errors.subTittle && <p className="mt-1 text-sm text-red-500">{errors.subTittle}</p>}

          <div>
            <label className="block text-sm font-medium">Subcategory</label>
            <Select
              options={subCategoryoptions}
              value={selectedSubCategory}
              onChange={handleSubCategoryChange}
              placeholder="Select Subcategory"
              className="w-full mt-2" />
          </div>

          {errors.selectedSubCategory && <p className="mt-1 text-sm text-red-500">{errors.selectedSubCategory}</p>}

          {/* File Input */}
          <label className="block font-medium">Add Image</label>
          <input
            type="file"
            onChange={(e) => {
              setImage(e.target.files[0])
              if (errors.image) {
                setErrors((prevErrors) => ({ ...prevErrors, image: '' }));
              }
            }}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5E34]"
          />

          {/* Preview Logic */}
          {image && (
            <Image
              src={typeof image === 'string' ? image : URL.createObjectURL(image)}
              width={128}
              height={128}
              alt="Preview"
              className="object-cover w-32 h-32 mt-2 border rounded"
            />
          )}

          {errors.image && <p className="mt-1 text-sm text-red-500">{errors.image}</p>}

          {/* Active Checkbox */}
          {editMode && (
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="w-5 h-5 mr-2 cursor-pointer" />
              <label className="text-sm font-medium text-gray-700">
                Active
              </label>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 text-white rounded-md bg-submit-btn hover:bg-green-700"
              disabled={loading}>
              {editMode ? 'Update' : 'Submit'}
            </button>

            <button
              type="button"
              onClick={() => {
                setErrors({});
                setShowForm(false);
                setEditMode(false);
                setSelectedSubCategory(null);
                setTittle('');
                setImage(null);
                setActive(false);
              }}
              className="px-4 py-2 text-white rounded-md bg-cancel-btn hover:bg-gray-600">
              Cancel
            </button>
          </div>
        </form>
      )}

      {!showForm && (
        <div>
          <Table
            columns={Columns}
            data={bannerData}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            title={'Banner'} />
        </div>
      )}
      <DeletePopup
        show={showDeletePopup}
        type="banner"
        name={bannerToDelete?.title}
        onCancel={() => setShowDeletePopup(false)}
        onConfirm={handleDeleteConfirm}
      />

    </div>
  );
};

export default Banner;
