import Cookies from "js-cookie";

export const addNewPost = async (post) => {
    await fetch(`http://localhost:8000/api/posts`, {
        method: 'POST',
        body: JSON.stringify(post),
        // credentials: 'include', // Don't forget to specify this if you need cookies
        headers: { Authorization: 'Bearer ' + Cookies.get("accessToken"), 'Content-Type': 'application/json'  }
    });
     
}

export const addNewComment = async (post_id, comment) => {
    await fetch(`http://localhost:8000/api/posts/${post_id}/comments`, {
        method: 'POST',
        body: JSON.stringify(comment),
        // credentials: 'include', // Don't forget to specify this if you need cookies
        headers: { Authorization: 'Bearer ' + Cookies.get("accessToken"), 'Content-Type': 'application/json'  }
    });  
}

export const getPosts = async () => {
    const data = await fetch('http://localhost:8000/api/posts', {
        method: 'GET',
        // credentials: 'include', // Don't forget to specify this if you need cookies
        headers: { Authorization: 'Bearer ' + Cookies.get("accessToken") }
    });
    const posts = await data.json();
    return posts  
}

export const getPostsByUser = async (user_id) => {
    const data = await fetch(`http://localhost:8000/api/posts/${user_id}`, {
        method: 'GET',
        // credentials: 'include', // Don't forget to specify this if you need cookies
        headers: { Authorization: 'Bearer ' + Cookies.get("accessToken") }
    });
    const posts = await data.json();
    return posts  
}

export const getFavouritesPostsByUser = async (user_id) => {
    const data = await fetch(`http://localhost:8000/api/posts/${user_id}/favourites`, {
        method: 'GET',
        // credentials: 'include', // Don't forget to specify this if you need cookies
        headers: { Authorization: 'Bearer ' + Cookies.get("accessToken") }
    });
    const posts = await data.json();
    return posts  
}

export const deletePost = async (post_id) => {
    await fetch(`http://localhost:8000/api/posts/${post_id}`, {
        method: 'DELETE',
        // credentials: 'include', // Don't forget to specify this if you need cookies
        headers: { Authorization: 'Bearer ' + Cookies.get("accessToken") }
    }); 
}

export const deleteComment = async (post_id, comment_id) => {
    await fetch(`http://localhost:8000/api/posts/${post_id}/${comment_id}`, {
        method: 'DELETE',
        // credentials: 'include', // Don't forget to specify this if you need cookies
        headers: { Authorization: 'Bearer ' + Cookies.get("accessToken") }
    }); 
}

export const likePost = async (post_id, user) => {
    await fetch(`http://localhost:8000/api/posts/${post_id}/like`, {
        method: 'POST',
        body: JSON.stringify(user),
        // credentials: 'include', // Don't forget to specify this if you need cookies
        headers: { Authorization: 'Bearer ' + Cookies.get("accessToken"), 'Content-Type': 'application/json' }
    }); 
}

export const unlikePost = async (post_id, user) => {
    await fetch(`http://localhost:8000/api/posts/${post_id}/unlike`, {
        method: 'POST',
        body: JSON.stringify(user),
        // credentials: 'include', // Don't forget to specify this if you need cookies
        headers: { Authorization: 'Bearer ' + Cookies.get("accessToken"), 'Content-Type': 'application/json' }
    }); 
}


export const addPostFavourite = async (post_id, user) => {
    await fetch(`http://localhost:8000/api/posts/${post_id}/addFavourite`, {
        method: 'POST',
        body: JSON.stringify(user),
        // credentials: 'include', // Don't forget to specify this if you need cookies
        headers: { Authorization: 'Bearer ' + Cookies.get("accessToken"), 'Content-Type': 'application/json' }
    }); 
}

export const deletePostFavourite = async (post_id, user) => {
    await fetch(`http://localhost:8000/api/posts/${post_id}/deleteFavourite`, {
        method: 'POST',
        body: JSON.stringify(user),
        // credentials: 'include', // Don't forget to specify this if you need cookies
        headers: { Authorization: 'Bearer ' + Cookies.get("accessToken"), 'Content-Type': 'application/json' }
    }); 
}