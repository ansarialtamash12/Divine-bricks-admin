export const API_ENDPOINTS = {
    GET_ALL_CONCERN: "/Concern/getAllConcern",
    ADD_CONCERN: "/Concern/addConcern",
    UPDATE_CONCERN: "/Concern/updateConcern",
    DELETE_CONCERN: "/Concern/deleteConcern",
    GET_ALL_ACTIVE_CONCERN:"/Concern/getAllActiveConcern"
};

export const Columns = [
    { key: 'id', label: 'S.No.' },
    { key: 'name', label: 'Concern Name' },
    { key: 'description', label: 'Description' },
    { key: 'status', label: 'Status' }
];