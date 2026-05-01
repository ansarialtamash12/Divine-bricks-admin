export const API_ENDPOINTS = {
  GET_ALL_PRODUCT: '/Product/getAllProduct',
  ADD_PRODUCT: '/Product/addProduct',
  DELETE_PRODUCT: '/Product/deleteProduct',
  UPDATE_PRODUCT: '/Product/updateProduct',
  ADD_PRODUCT_IMAGE: '/Product/addProductImage',
  GET_BY_ID_PRODUCT: '/Product/getByIdProduct',
  GET_BY_ID_IMAGE: '/Product/getByIdImage',
  UPDATE_METATAGS_BY_PRODUCTID:'/Product/updateMetaTagsByProductId'
};

export const Columns = [
  { key: 'image', label: 'Image' },
  { key: 'id', label: 'S.No.' },
  { key: 'productName', label: 'Title' },
  { key: 'description', label: 'Description' },
  { key: 'categoryName', label: 'Category Name' },
  { key: 'subCategoryName', label: 'SubCategory Name' },
  { key: 'subCategoryTypeName', label: 'SubCategory Type Name' },
  { key: 'sellerName', label: 'Seller Name' },
  { key: 'sizeName', label: 'Size Name' },
  { key: 'concernName', label: 'Concern Name' },
  { key: 'ingredientName', label: 'Ingredient Name' },
  { key: 'subName', label: 'Sub Title' },
  { key: 'rating', label: 'Rating' },
  { key: 'mrp', label: 'MRP'},
  { key: 'price', label: 'Price' },
  { key: 'discountPrice', label: 'Discount Price' },
  { key: 'status', label: 'Status' },
];