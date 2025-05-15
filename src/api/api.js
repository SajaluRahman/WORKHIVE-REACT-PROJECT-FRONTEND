import axios from 'axios';

const BASE_URL = 'http://localhost:4004/api'; // Replace with your API base URL

// Helper function to handle API requests
async function apiRequest(endpoint, method = 'GET', data = null, headers = {}) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      data,
    };

    if (data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    }

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`Error in ${method} ${endpoint}:`, error);
    throw error.response?.data?.error || error.message;
  }
}

// API function to create a new post
export const addPost = async (postData) => {
  const formData = new FormData();
  formData.append('title', postData.title);
  formData.append('category', postData.category);
  formData.append('description', postData.description);
  formData.append('description1', postData.description1 || '');
  formData.append('price', postData.price);
  formData.append('pay', postData.pay);
  formData.append('hourlyRate', postData.hourlyRate);
  formData.append('duration', postData.duration || '');
  formData.append('requirements', JSON.stringify(postData.requirements));
  formData.append('qualifications', postData.qualifications || '');
  formData.append('bonus', postData.bonus || '');
  formData.append('paymentMethod', postData.paymentMethod || '');
  formData.append('paymentFrequency', postData.paymentFrequency || '');
  formData.append('paymentStructure', postData.paymentStructure || '');
  postData.images.forEach((img) => formData.append('images', img));

  return apiRequest('/post/add-post', 'POST', formData);
};

// API function to fetch a single post by ID
export const getSinglePost = async (id) => {
  return apiRequest(`/post/single-post/${id}`, 'GET');
};

// API function to upload profile photo
export const uploadProfilePhoto = async (profilePhoto) => {
  const formData = new FormData();
  formData.append('profilePhoto', profilePhoto);
  return apiRequest('/clientprofile/upload-profilePhoto', 'POST', formData);
};

// API function to fetch all posts
export const getAllPosts = async () => {
  return apiRequest('/post/all-posts', 'GET');
};

// API function to delete a post
export const deletePost = async (postId) => {
  return apiRequest(`/post/delete-post/${postId}`, 'DELETE');
};

// API function to handle user login
export const login = async (loginData) => {
  return apiRequest('/user/login', 'POST', loginData);
};