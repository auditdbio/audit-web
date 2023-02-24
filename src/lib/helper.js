import Cookies from "js-cookie";

export const isAuth = () => {
    const token =  Cookies.get('token')
    const sessionToken =  JSON.parse( sessionStorage.getItem("token"))
    return !!(token && sessionToken)
}