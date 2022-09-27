export function setUser(authUser){
    return {
        type: 'SET_USER',
        user: authUser,
    }
}

export function setUserApi(authUser){
    return {
        type: 'SET_USER_API',
        userApi: authUser,
    }
}