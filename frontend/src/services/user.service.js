import Cookies from "js-cookie";

export const getUserById = async (user_id) => {
    const data = await fetch(`http://localhost:8000/api/users/${user_id}`, {
        method: 'GET',
        // credentials: 'include', // Don't forget to specify this if you need cookies
        headers: { Authorization: 'Bearer ' + Cookies.get("accessToken") }
    });
    const user = await data.json();
    return user  
}