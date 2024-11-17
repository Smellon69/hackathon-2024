"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  userType: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  licenseNumber?: string;
  name: string;
}

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [userType, setUserType] = useState<string>('patient');
  const [formData, setFormData] = useState<{
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    licenseNumber: string;
  }>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    licenseNumber: '',
  });
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const validLicenseNumbers = [
    'MD123456',
    'MD654321',
    'MD111111',
    'MD222222',
    'MD333333',
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');

    if (isLogin) {
      const user = users.find(
        (u) =>
          u.email === formData.email &&
          u.password === formData.password &&
          u.userType === userType
      );

      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        if (user.userType === 'doctor') {
          router.push('/doctor-dashboard');
        } else if (user.userType === 'patient') {
          router.push('/patient-dashboard');
        }
      } else {
        setError('Invalid email or password');
      }
    } else {
      const existingUser = users.find(
        (u) => u.email === formData.email && u.userType === userType
      );

      if (existingUser) {
        setError('User already exists');
      } else {
        if (userType === 'doctor') {
          if (!validLicenseNumbers.includes(formData.licenseNumber.trim())) {
            setError('Invalid medical license number');
            return;
          }
        }

        const newUser: User = {
          id: Date.now(),
          userType: userType,
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          licenseNumber: formData.licenseNumber,
          name: `${formData.firstName} ${formData.lastName}`,
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(newUser));

        if (newUser.userType === 'doctor') {
          router.push('/doctor-dashboard');
        } else if (newUser.userType === 'patient') {
          router.push('/patient-dashboard');
        }
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Valdosta Medicine
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {isLogin ? 'Welcome back' : 'Create your account'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="mb-4">
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setIsLogin(true)}
                className={`px-4 py-2 rounded-md ${
                  isLogin
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`px-4 py-2 rounded-md ${
                  !isLogin
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Register
              </button>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                I am a:
              </label>
              <div className="mt-2 flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="userType"
                    value="patient"
                    checked={userType === 'patient'}
                    onChange={(e) => setUserType(e.target.value)}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2">Patient</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="userType"
                    value="doctor"
                    checked={userType === 'doctor'}
                    onChange={(e) => setUserType(e.target.value)}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2">Doctor</span>
                </label>
              </div>
            </div>

            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {userType === 'doctor' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Medical License Number
                    </label>
                    <input
                      type="text"
                      name="licenseNumber"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      onChange={handleChange}
                    />
                  </div>
                )}
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                onChange={handleChange}
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  onChange={handleChange}
                />
              </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </div>
          </form>

          {isLogin && (
            <div className="mt-4 text-center">
              <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
                Forgot your password?
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;