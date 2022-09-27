export const initialState = {
    user: null,
    userApi: null
}

export const actionTypes = {
    SET_USER: "SET_USER",
    SET_USER_API: "SET_USER_API"
}

const reducer = (state, action) => {

    switch (action.type) {
        case actionTypes.SET_USER:
            return {
                ...state,
                user: action.user,
            };
        case actionTypes.SET_USER_API:
            return {
                ...state,
                userApi: action.userApi,
            };

        default:
            return state;
    }
}

export default reducer;