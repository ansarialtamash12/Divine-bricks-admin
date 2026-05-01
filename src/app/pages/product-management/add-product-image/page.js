
"use client";
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addProductImage, getProductList, getByIdImage } from '@/app/redux/productSlice';
import { toast } from 'react-toastify';

const AddProductImage = ({ onClose, product }) => {
  const [image, setImage] = useState(null);
  const [client, setClient] = useState(false);
  const dispatch = useDispatch();
  const { loading, imageDetails } = useSelector((state) => state.product);
  const [preview, setPreview] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

  useEffect(() => {
    setClient(true);
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!product) return;
    const productId = product.productId || "";
    const title = product.productName || "Untitled";

    if (!image) {
      console.error("No image selected");
      return;
    }

    const productImageData = {
      productId,
      title,
      image,
    };

    try {
      const response = await dispatch(addProductImage(productImageData)).unwrap();
      if (response.statusCode === 200) {
        toast.success(response.message);
        setUploadedImageUrl(response?.data?.imageUrls?.[0]);
      }
      else {
        toast.error(response.message);
      }
      await dispatch(getProductList()).unwrap();
      await dispatch(getByIdImage(productId)).unwrap();
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  if (!client) return null;

  return (
    <div className="p-4">
      <h1 className="mb-2 text-lg font-bold text-center text-red-700 md:text-xl">Uploaded only 4 images</h1>
      
      <div className="mt-5">
        <h2 className="mb-4 text-base font-semibold md:text-lg">Upload Product Image</h2>
        
        <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-2 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-white rounded bg-submit-btn hover:bg-blue-700"
            >
              {loading ? 'Uploading...' : 'Submit'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-white rounded bg-cancel-btn hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>

        {preview && (
          <div className="mb-4">
            <img src={preview} alt="Selected Preview" className="w-20 h-20 rounded-md" />
          </div>
        )}

        {uploadedImageUrl && (
          <div className="pt-4 border-t">
            <h3 className="mb-2 text-sm font-medium md:text-md">Uploaded Image:</h3>
            <img src={uploadedImageUrl} alt="Uploaded Product" className="w-full h-auto rounded-md" />
          </div>
        )}
      </div>
      
      <div className="p-4">
        {Array.isArray(imageDetails) && imageDetails.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {imageDetails.map((imgObj, index) => (
              <img
                key={index}
                src={imgObj.imageUrl}
                alt={`Product Image ${index + 1}`}
                className="object-cover w-full h-32 rounded sm:h-48"
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No images found for this product.</p>
        )}
      </div>
    </div>
  );
};

export default AddProductImage;