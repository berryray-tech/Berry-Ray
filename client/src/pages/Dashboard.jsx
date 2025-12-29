import React, { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Dashboard() {
    // State to manage course data for the list
    const [courses, setCourses] = useState([]);
    // State to manage input fields for the add form
    const [newCourse, setNewCourse] = useState({ title: '', description: '', price: '', duration: '', image: '' });
    const [statusMessage, setStatusMessage] = useState('');

    // --- Data Fetching ---
    const fetchCourses = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/courses`);
            const data = await response.json();
            setCourses(data);
        } catch (error) {
            console.error('Fetch error:', error);
            setStatusMessage('Error loading courses for dashboard.');
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    // --- Handler for Adding a Course (CREATE) ---
    const handleAddCourse = async (e) => {
        e.preventDefault();
        setStatusMessage('Adding course...');

        try {
            const response = await fetch(`${API_BASE_URL}/courses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newCourse),
            });

            const result = await response.json();

            if (response.ok) {
                setStatusMessage(result.message);
                setNewCourse({ title: '', description: '', price: '', duration: '', image: '' }); // Clear form
                fetchCourses(); // Refresh the list
            } else {
                setStatusMessage(`Error: ${result.message || 'Failed to add course.'}`);
            }
        } catch (error) {
            setStatusMessage(`Network error: ${error.message}`);
        }
    };

    // --- Handler for Removing a Course (DELETE) ---
    const handleDeleteCourse = async (courseId) => {
        if (!window.confirm("Are you sure you want to delete this course?")) {
            return;
        }

        setStatusMessage(`Deleting course ${courseId}...`);
        
        try {
            const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
                method: 'DELETE',
            });

            const result = await response.json();

            if (response.ok) {
                setStatusMessage(result.message);
                fetchCourses(); // Refresh the list
            } else {
                setStatusMessage(`Error: ${result.message || 'Failed to delete course.'}`);
            }
        } catch (error) {
            setStatusMessage(`Network error: ${error.message}`);
        }
    };

    return (
        <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Admin Dashboard</h1>

            {/* Status Message Area */}
            {statusMessage && (
                <div className="p-4 mb-6 rounded-md bg-indigo-100 text-indigo-700 font-medium">
                    {statusMessage}
                </div>
            )}

            {/* Add Course Form */}
            <div className="bg-white shadow-xl rounded-lg p-6 mb-10">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Add New Course</h2>
                <form onSubmit={handleAddCourse} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                        type="text" name="title" placeholder="Title" required
                        value={newCourse.title} 
                        onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                        className="p-3 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <input 
                        type="number" name="price" placeholder="Price (₦)" required
                        value={newCourse.price} 
                        onChange={(e) => setNewCourse({...newCourse, price: e.target.value})}
                        className="p-3 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <input 
                        type="text" name="duration" placeholder="Duration (e.g., 12 Weeks)" required
                        value={newCourse.duration} 
                        onChange={(e) => setNewCourse({...newCourse, duration: e.target.value})}
                        className="p-3 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <input 
                        type="url" name="image" placeholder="Image URL (Optional)"
                        value={newCourse.image} 
                        onChange={(e) => setNewCourse({...newCourse, image: e.target.value})}
                        className="p-3 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <textarea 
                        name="description" placeholder="Description" required
                        value={newCourse.description} 
                        onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                        className="p-3 border rounded-lg md:col-span-2 focus:ring-indigo-500 focus:border-indigo-500"
                        rows="3"
                    ></textarea>
                    <button 
                        type="submit" 
                        className="md:col-span-2 bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition duration-150"
                    >
                        Add Course
                    </button>
                </form>
            </div>

            {/* Course List with Delete Buttons */}
            <div className="bg-white shadow-xl rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Existing Courses ({courses.length})</h2>
                
                {courses.length === 0 ? (
                    <p className="text-gray-500">No courses available. Use the form above to add one.</p>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {courses.map((course) => (
                            <div key={course._id} className="flex justify-between items-center py-4">
                                <div className="flex-1 min-w-0 pr-4">
                                    <p className="text-lg font-medium text-gray-900">{course.title}</p>
                                    <p className="text-sm text-gray-500 truncate">ID: {course._id}</p>
                                </div>
                                <div className="ml-4 flex-shrink-0">
                                    <button
                                        onClick={() => handleDeleteCourse(course._id)}
                                        className="bg-red-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-red-600 transition duration-150"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}