export const API_ENDPOINTS = {
    GET_ALL_STEPS: "/Product/getAllSteps",
    ADD_ALL_STEPS: "/Product/addAllSteps",
    UPDATE_ALL_STEPS: "/Product/updateAllSteps",
    DELETE_ALL_STEPS: "/Product/deleteAllSteps",
    GET_ALL_ACTIVE_STEPS:"/Product/getAllActiveSteps"
};

export const Columns = [
    { key: 'id', label: 'S.No.' },
    { key: 'name', label: 'Step Name' },
    { key: 'description', label: 'Step Description' },
    { key: 'status', label: 'Status' }
];    