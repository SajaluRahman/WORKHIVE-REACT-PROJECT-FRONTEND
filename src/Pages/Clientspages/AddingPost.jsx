import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { addPost } from '../../api/api'; // Import the API function

function AddingPost() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [images, setImages] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [requirements, setRequirements] = useState([]);
  const [requirementInput, setRequirementInput] = useState('');
  const navigate = useNavigate();

  const handleSkillAdd = () => {
    const trimmed = skillInput.trim();
    if (!trimmed) return;
    if (!skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
    }
    setSkillInput('');
  };

  const removeSkill = (skill) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImages([...images, file]);
    }
    e.target.value = '';
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleRequirementAdd = () => {
    const trimmed = requirementInput.trim();
    if (!trimmed) return;
    if (!requirements.includes(trimmed)) {
      setRequirements([...requirements, trimmed]);
    }
    setRequirementInput('');
  };

  const removeRequirement = (requirement) => {
    setRequirements(requirements.filter((r) => r !== requirement));
  };

  const handleCloseAdd = () => {
    navigate('/clientprofile');
  };

  const onSubmit = async (data) => {
    if (skills.length === 0) {
      alert('Please add at least one skill before submitting.');
      return;
    }

    try {
      await addPost({ ...data, skills, requirements, images });
      setSuccessMessage('Post created successfully!');
      navigate('/clientprofile');
    } catch (err) {
      alert(`Error uploading post: ${err}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-4xl overflow-y-auto max-h-screen">
        {successMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-md w-full animate-fade-in">
              <h2 className="text-2xl font-semibold text-green-700 mb-2">Success!</h2>
              <p className="text-gray-800 mb-4">{successMessage}</p>
              <button
                onClick={() => {
                  setSuccessMessage('');
                  navigate('/clientprofile');
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                OK
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Add New Post</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-5 text-gray-700">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              {...register('title', { required: 'Title is required' })}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter title"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <input
              {...register('category', { required: 'Category is required' })}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter category"
            />
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              {...register('description', { required: 'Description is required' })}
              rows="3"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter description"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Additional Description</label>
            <textarea
              {...register('description1')}
              rows="3"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter additional description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input
              type="number"
              {...register('price', { required: 'Price is required' })}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter price"
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Pay</label>
            <input
              type="text"
              {...register('pay', { required: 'Pay is required' })}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter pay"
            />
            {errors.pay && <p className="text-red-500 text-sm mt-1">{errors.pay.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Hourly Rate</label>
            <input
              type="number"
              {...register('hourlyRate')}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter hourly rate"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Duration</label>
            <input
              type="text"
              {...register('duration')}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter duration"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Requirements</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={requirementInput}
                onChange={(e) => setRequirementInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleRequirementAdd();
                  }
                }}
                className="flex-grow p-2 border border-gray-300 rounded-md"
                placeholder="Type requirement and press Enter"
              />
              <button
                type="button"
                onClick={handleRequirementAdd}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {requirements.map((requirement, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
                >
                  {requirement}
                  <button
                    type="button"
                    onClick={() => removeRequirement(requirement)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Skills Needed</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSkillAdd();
                  }
                }}
                className="flex-grow p-2 border border-gray-300 rounded-md"
                placeholder="Type skill and press Enter"
              />
              <button
                type="button"
                onClick={handleSkillAdd}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Add Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {images.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-4">
                {images.map((img, i) => (
                  <div key={i} className="relative w-24 h-24">
                    <img
                      src={URL.createObjectURL(img)}
                      alt="preview"
                      className="w-full h-full object-cover rounded-md border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute -top-2 -right-2 bg-white border rounded-full p-1 text-red-500 hover:text-red-700 shadow"
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Qualifications</label>
            <input
              type="text"
              {...register('qualifications')}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter qualifications"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Bonus</label>
            <input
              type="text"
              {...register('bonus')}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter bonus"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Payment Method</label>
            <input
              type="text"
              {...register('paymentMethod')}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter payment method"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Payment Frequency</label>
            <input
              type="text"
              {...register('paymentFrequency')}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter payment frequency"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Payment Structure</label>
            <input
              type="text"
              {...register('paymentStructure')}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter payment structure"
            />
          </div>

          <div className="md:col-span-2 mt-6 flex justify-between items-center">
            <button
              type="button"
              onClick={handleCloseAdd}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Create Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddingPost;