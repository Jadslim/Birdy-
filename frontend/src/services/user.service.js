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

export const addProfileImage = async(user_id, image) => {
    await fetch(`http://localhost:8000/api/image/${user_id}`, {
        method: 'POST',
        body: JSON.stringify(image),
        // credentials: 'include', // Don't forget to specify this if you need cookies
        headers: { Authorization: 'Bearer ' + Cookies.get("accessToken"), 'Content-Type': 'application/json' }
    });
}

export const addProfileBio = async(user_id, bio) => {
    await fetch(`http://localhost:8000/api/bio/${user_id}`, {
        method: 'POST',
        body: JSON.stringify(bio),
        // credentials: 'include', // Don't forget to specify this if you need cookies
        headers: { Authorization: 'Bearer ' + Cookies.get("accessToken"), 'Content-Type': 'application/json' }
    });
}

export const followUser = async (user_id, follower) => {
    await fetch(`http://localhost:8000/api/users/${user_id}/follow`, {
        method: 'POST',
        body: JSON.stringify(follower),
        // credentials: 'include', // Don't forget to specify this if you need cookies
        headers: { Authorization: 'Bearer ' + Cookies.get("accessToken"), 'Content-Type': 'application/json' }
    }); 
}

export const unfollowUser = async (user_id, follower) => {
    await fetch(`http://localhost:8000/api/users/${user_id}/unfollow`, {
        method: 'POST',
        body: JSON.stringify(follower),
        // credentials: 'include', // Don't forget to specify this if you need cookies
        headers: { Authorization: 'Bearer ' + Cookies.get("accessToken"), 'Content-Type': 'application/json' }
    }); 
}

export const getFollowers = async (user_id) => {
    const data = await fetch(`http://localhost:8000/api/users/${user_id}/followers`, {
        method: 'GET',
        // credentials: 'include', // Don't forget to specify this if you need cookies
        headers: { Authorization: 'Bearer ' + Cookies.get("accessToken") }
    }); 
    const followers = await data.json();
    return followers  
}

export const getFollowings = async (user_id) => {
    const data = await fetch(`http://localhost:8000/api/users/${user_id}/followings`, {
        method: 'GET',
        // credentials: 'include', // Don't forget to specify this if you need cookies
        headers: { Authorization: 'Bearer ' + Cookies.get("accessToken") }
    }); 
    const followings = await data.json();
    return followings  
}