import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { authActions } from '../store/auth';
import { useDispatch } from 'react-redux';

const LogIn = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.email || !formData.password) {
            setError('Please fill in all fields.');
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post('https://dav08library.onrender.com/api/v1/sign-in', formData);

            if (response.data.token) {
                localStorage.setItem("id", response.data.id);
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("role", response.data.role);
                
                dispatch(authActions.login());
                dispatch(authActions.changeRole(response.data.role));

                setFormData({ email: '', password: '' });
                navigate("/");
            } else {
                setError(response.data.message || 'Login failed.');
            }
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to log in. Please try again.';
            setError(message);
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="text-4xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                        Welcome ,LogIn
                    </h2>
                    <p className="mt-1 text-gray-400">Welcome Back to DAV ISPAT Library</p>
                </div>

                <div className="relative bg-gray-800 rounded-lg p-8 shadow-xl border border-gray-700">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && <div className="p-4 bg-red-900/50 border border-red-500/50 rounded-lg text-red-200 text-sm">{error}</div>}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email address</label>
                            <div className="relative">
                                <EnvelopeIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="pl-10 w-full px-4 py-2.5 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                            <div className="relative">
                                <LockClosedIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="pl-10 w-full px-4 py-2.5 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : 'transform hover:scale-[1.02]'}`}
                        >
                            {loading ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : 'Log In'}
                        </button>
                    </form>
                </div>

                <div className="text-center">
                    <p className="text-sm text-gray-400">
                        Don't have an account? <Link to="/signUp" className="font-medium text-blue-400 hover:text-blue-300 transition-colors duration-200">Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LogIn;
