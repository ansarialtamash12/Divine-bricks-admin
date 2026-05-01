export const API_ENDPOINTS = {
    GET_ALL_INGREDIENT: "/Ingredient/getAllIngredient",
    ADD_INGREDIENT: "/Ingredient/addIngredient",
    UPDATE_INGREDIENT: "/Ingredient/updateIngredient",
    DELETE_INGREDIENT: "/Ingredient/deleteIngredient",
    GET_ALL_INGREDIENT_ACTIVE:"/Ingredient/getAllIngredientActive"
};

export const Columns = [
    { key: 'id', label: 'S.No.' },
    { key: 'name', label: 'Ingredient Name' },
    { key: 'description', label: 'Description' },
    { key: 'status', label: 'Status' }
];