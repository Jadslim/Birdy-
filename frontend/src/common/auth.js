import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";

export function checkUser(){
    const token = Cookies.get("accessToken");
    if (token){
        const decodedToken = jwt_decode(token)
        if (decodedToken.exp * 1000 > Date.now()){
            return true         
            
        }
    }
    return false

}

export function getDecodedToken(){
    const token = Cookies.get("accessToken");
    if (token){
        const decodedToken = jwt_decode(token)
        return decodedToken
    }
    return null
}