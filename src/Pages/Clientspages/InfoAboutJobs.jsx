import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Navigation, Pagination } from 'swiper/modules';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../../App.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { getSinglePost } from '../../api/api'; // Import the API function

function InfoAboutJobs() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getSinglePost(id);
        if (data && data.post) {
          setPost(data.post);
        } else {
          console.error('Post not found');
        }
      } catch (err) {
        console.error('Failed to fetch post details', err);
      }
    };

    fetchPost();
  }, [id]);

  if (!post) return <div className="p-6 text-center">Loading post details...</div>;

  const requirements = Array.isArray(post.requirements) ? post.requirements : [];

  return (
    <div className="min-h-screen w-full bg-[#F9FAFB] text-[#333333] md:p-6 flex justify-center items-center">
      <div className="md:max-w-5xl w-full bg-[#f0f5ff] shadow-lg rounded-2xl p-6 flex flex-col md:flex-row">
        {/* Left Side - Job Details & Images */}
        <div className="w-full md:w-1/2 max-h-[80vh] overflow-scroll no-scrollbar md:p-6">
          <h1 className="text-2xl font-bold text-[#333333]">Explore Freelance {post.title}</h1>

          {/* Post Rating */}
          <div className="flex items-center mt-2">
            <span className="text-yellow-400 text-lg">★</span>
            <span className="text-[#6B7280] ml-1 font-semibold">{post.rating || 'N/A'}/5</span>
          </div>

          <h3 className="text-lg font-semibold text-[#333333] mt-4">{post.title}</h3>
          <ul className="mt-2 text-[#6B7280] space-y-2">
            <h3 className="text-md font-semibold text-[#333333] mt-4">Requirements:</h3>

            {requirements.length > 0 ? (
              requirements.map((requirement, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <span className="text-[#4CAF50]">✔</span>
                  <span>{requirement}</span>
                </li>
              ))
            ) : (
              <li>No requirements specified</li>
            )}
          </ul>

          <h3 className="text-md font-semibold text-[#333333] mt-4">Detailed description</h3>
          <p className="mt-2 text-[#6B7280] space-y-2">{post.description1 || 'No description available'}</p>

          {/* Skills Section */}
          <h3 className="text-md font-semibold text-[#333333] mt-4">Required Skills:</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {post.skillsNeeded && post.skillsNeeded.length > 0 ? (
              post.skillsNeeded.map((skill, index) => (
                <span key={index} className="bg-[#DBEAFE] text-[#1D4ED8] px-3 py-1 rounded-full text-sm font-medium">
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-[#6B7280]">No skills listed</span>
            )}
          </div>

          {/* Qualifications Section */}
          <h3 className="text-md font-semibold text-[#333333] mt-4">Qualifications:</h3>
          <p className="text-[#6B7280]">{post.qualifications || 'No qualifications specified'}</p>

          {/* Image Carousel */}
          {post.images && post.images.length > 0 ? (
            <div className="mt-4">
              <Swiper
                spaceBetween={10}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                modules={[Navigation, Pagination]}
                className="w-full"
              >
                {post.images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={`http://localhost:4004/uploads/${image}`}
                      alt="Work example"
                      className="h-64 w-full rounded-lg object-cover"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ) : (
            <div className="mt-4">
              <img
                src="/fallback.jpg"
                alt="No images available"
                className="h-64 w-full rounded-lg object-cover"
              />
            </div>
          )}
        </div>

        {/* Right Side - Payment Details */}
        <div className="w-full md:w-1/2 max-h-fit p-6 bg-white rounded-lg shadow-md mt-6 md:mt-0">
          <div className="flex items-center space-x-4 mb-4">
            <img
              src={post.userImage || '/fallback.jpg'}
              alt="User"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h3 className="text-lg font-semibold text-[#4CAF50]">{post.user}</h3>
              <p className="text-sm text-[#6B7280]">Post Poster</p>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-[#4CAF50]">Payment Details</h3>
          <p className="text-xl font-bold text-[#333333]">{post.pay || 'Not provided'}</p>
          <p className="text-[#6B7280]">{post.hourlyRate || 'Not specified'} (Hourly Rate)</p>
          <p className="text-[#9CA3AF]">{post.duration || 'Not specified'}</p>

          {/* Additional Payment Details */}
          <p className="text-[#6B7280]"><strong>Payment Structure:</strong> {post.paymentStructure || 'Not provided'}</p>
          <p className="text-[#6B7280]"><strong>Bonus/Incentives:</strong> {post.bonus || 'Not provided'}</p>
          <p className="text-[#6B7280]"><strong>Payment Method:</strong> {post.paymentMethod || 'Not provided'}</p>
          <p className="text-[#6B7280]"><strong>Payment Frequency:</strong> {post.paymentFrequency || 'Not provided'}</p>
        </div>
      </div>
    </div>
  );
}

export default InfoAboutJobs;