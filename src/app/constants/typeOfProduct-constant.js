export const API_ENDPOINTS = {
    GET_ALL_TYPE_OF_PRODUCT: "/Product/getAllTypeofProduct",
    ADD_TYPE_OF_PRODUCT: "/Product/addTypeOfProduct",
    UPDATE_TYPE_OF_PRODUCT: "/Product/updateTypeOfProduct",
    DELETE_TYPE_OF_PRODUCT: "/Product/deleteTypeOfProduct",
    GET_ALL_TYPE_OF_ACTIVE_PRODUCT:"/Product/getAllTypeofActiveProduct"
};
export const Columns = [
    { key: 'id', label: 'S.No.' },
    { key: 'name', label: 'Product Type Name' },
    { key: 'description', label: 'Description' },
    { key: 'status', label: 'Status' }
];
