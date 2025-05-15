import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import img1 from "../../images/pexels-rfera-432059.jpg";
import { Navbar3 } from "../../Components/Common/CommonComponents/Navbar";
import { Sidebar2 } from "../../Components/FreelancerComponents/Sidebar";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { uploadProfilePhoto, getAllPosts, deletePost } from '../../api/api'; // Import API functions

function ClientProfile() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Posts");
  const [isEditing, setIsEditing] = useState(false);
  const [posts, setPosts] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [profileImage, setProfileImage] = useState(null); // New: for image file
  const [previewImage, setPreviewImage] = useState(img1); // New: for preview display

  const dropdownRef = useRef(null);
  const Navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "Maymoona",
    role: "ABCD Company",
    description: "I am an ABCD company manager hiring freelancers...",
    linkedin: "http://xyz.in",
    phone: "+01 12345678",
    email: "maymoona123@gmail.com",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: formData,
  });

  useEffect(() => {
    if (isEditing) {
      reset(formData);
    }
  }, [isEditing, formData, reset]);

  const handleEditClick = () => setIsEditing(true);
  const toAddPost = () => Navigate("/addingpost");

  const onSubmit = async (data) => {
    try {
      // Save profile text data
      setFormData(data);
      setIsEditing(false);

      // If there's a new image, upload it
      if (profileImage) {
        const res = await uploadProfilePhoto(profileImage);
        if (res.imageUrl) {
          setPreviewImage(res.imageUrl); // Update preview with uploaded image URL
        }
      }
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await getAllPosts();
      if (res && res.posts) {
        setPosts(res.posts);
      }
    } catch (err) {
      console.error("Failed to fetch posts", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = async (postId) => {
    try {
      await deletePost(postId);
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
      setActiveDropdown(null);
    } catch (err) {
      console.error("Failed to delete post", err);
    }
  };

  const toMoreInfo = (postId) => {
    Navigate(`/post-info/${postId}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-black">
      <Navbar3 />

      {/* Sidebar Toggle */}
      <div className="fixed bottom-8 z-50">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 bg-gray-200 rounded-full shadow">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-gray-700">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5M3.75 12h16.5M3.75 18.75h16.5" />
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} transition w-64 bg-white border-r`}>
        <Sidebar2 />
      </div>

      {/* Main */}
      <div className="pt-20 p-6 flex flex-col items-center w-full">
        {/* Profile Section */}
        <div className="w-full max-w-6xl bg-white p-6 rounded-xl shadow-lg flex flex-col md:flex-row justify-between border">
          <div className="flex flex-col sm:flex-row sm:items-center space-x-6">
            <img
              src={previewImage}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-gray-200 shadow"
            />
            <div>
              {!isEditing ? (
                <>
                  <h2 className="text-xl font-bold">{formData.name}</h2>
                  <p>{formData.role}</p>
                  <p className="mt-2">{formData.description}</p>
                  <p className="text-sm mt-2">{formData.phone} | {formData.email}</p>
                  <button onClick={handleEditClick} className="mt-3 px-4 py-1 text-sm bg-yellow-400 hover:bg-yellow-500 rounded">
                    Edit Profile
                  </button>
                </>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                  <input {...register("name")} className="border p-1 rounded w-full" />
                  <input {...register("role")} className="border p-1 rounded w-full" />
                  <textarea {...register("description")} className="border p-1 rounded w-full" />
                  <input {...register("phone")} className="border p-1 rounded w-full" />
                  <input {...register("email")} className="border p-1 rounded w-full" />
                  <input type="file" onChange={(e) => {
                    setProfileImage(e.target.files[0]);
                    setPreviewImage(URL.createObjectURL(e.target.files[0]));
                  }} className="border p-1 rounded w-full" />
                  <button type="submit" className="px-4 py-1 bg-green-500 text-white rounded">Save</button>
                </form>
              )}
            </div>
          </div>

          <button onClick={toAddPost} className="px-3 py-2 bg-green-500 text-white rounded-lg">
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>

        {/* Posts Grid */}
        <div className="flex-1 p- md:px-40 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-10 max-h-[80vh] no-scrollbar overflow-scroll">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post._id} className="bg-white cursor-pointer hover:scale-105 transition-all hover:shadow-xl ease-in-out shadow-md rounded-lg overflow-hidden p-3">
                <img
                  src={post.images && post.images.length ? `http://localhost:4004/uploads/${post.images[0]}` : "/fallback.jpg"}
                  alt="Post"
                  className="w-full h-80 sm:h-48 object-cover rounded-md"
                />

                <div className="p-3 flex flex-col flex-grow justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <img
                        src={post.authorImage || img1}
                        className="w-8 h-8 rounded-full border border-gray-300"
                        alt="Author"
                      />
                      <h3 className="text-sm font-semibold text-gray-900">{formData.name}</h3>
                    </div>
                    <p className="text-gray-600 mt-1 text-xs sm:text-sm">{post.description}</p>

                    <div className="flex items-center justify-between mt-2 relative">
                      <span className="text-gray-800 font-semibold text-sm">${post.price}</span>

                      {/* 3-dots Dropdown */}
                      <div className="relative">
                        <button
                          onClick={() => setActiveDropdown(post._id)}
                          className="text-gray-600 hover:text-gray-900 focus:outline-none"
                        >
                          ⋮
                        </button>

                        {activeDropdown === post._id && (
                          <div
                            ref={dropdownRef}
                            className="absolute right-0 bottom-5 w-32 bg-white rounded-lg shadow-lg z-20 border"
                          >
                            <button
                              onClick={() => handleDelete(post._id)}
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* More Info Button */}
                  <button
                    onClick={() => toMoreInfo(post._id)}
                    className="mt-4 w-full px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium"
                  >
                    More Info
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div>No posts available</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClientProfile;