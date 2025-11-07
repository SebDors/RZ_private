import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Retrieves the authentication token from localStorage or sessionStorage.
 * @returns The token string if found, otherwise null.
 */
export const getToken = (): string | null => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

/**
 * It checks for an authentication token
 * and redirects to the dashboard if there is a token 
 * or to the login page if no token is found.
 */
export const redirectAuth = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (getToken()) {
      console.log("redirected to dashboard")
      navigate('/dashboard')
    } else {
      console.log("redirected to login")
      navigate('/login')
    }
  }, [navigate]);
};

/**
 * It checks for an authentication token 
 * and redirects to the dashboard if there is a token
 */
export const redirectIfAuth = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (getToken()) {
      console.log("redirected to dashboard")
      // console.log(getToken())
      navigate('/dashboard')
    }
  }, [navigate]);
};

/**
 * It checks for an authentication token
 * and redirects to the login page if no token is found.
 */
export const redirectIfNotAuth = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!getToken()) {
      console.log("redirected to login")
      navigate('/login')
    }
  }, [navigate]);
};