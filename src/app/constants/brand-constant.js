export const API_ENDPOINTS = {
    GET_ALL_BRAND: "/Brand/getAllBrand",
    ADD_BRAND: "/Brand/addBrand",
    UPDATE_BRAND: "/Brand/updateBrand",
    DELETE_BRAND: "/Brand/deleteBrand",
    GET_ALL_BRAND_FOR_USER : "/Brand/getAllBrandForUser"
};

export const Columns = [
    { key: 'id', label: 'S.No.' },
    { key: 'name', label: 'Brand Name' },
    { key: 'description', label: 'Description' },
    { key: 'status', label: 'Status' }
];