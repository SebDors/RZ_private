import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkToken } from '@/services/auth';
import { useAuth } from './useAuth';

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
export const useRedirectAuth = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = getToken();
    if (token) {
      checkToken(token).then(result => {
        if (result.isValid) {
          console.log("redirected to dashboard")
          navigate('/dashboard');
        } else {
          console.log("redirected to login")
          navigate('/login');
        }
      });
    } else {
      console.log("redirected to login")
      navigate('/login');
    }
  }, [navigate]);
};

/**
 * It checks for an authentication token 
 * and redirects to the dashboard if there is a token
 */
export const useRedirectIfAuth = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = getToken();
    if (token) {
      checkToken(token).then(result => {
        if (result.isValid) {
          console.log("redirected to dashboard")
          navigate('/dashboard');
        }
      });
    }
  }, [navigate]);
};

/**
 * It checks for an authentication token
 * and redirects to the login page if no token is found.
 */
export const useRedirectIfNotAuth = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = getToken();
    if (token) {
      checkToken(token).then(result => {
        if (!result.isValid) {
          console.log("redirected to login")
          navigate('/login');
        }
      });
    } else {
      console.log("redirected to login")
      navigate('/login');
    }
  }, [navigate]);
};

/**
 * It checks if the user is an admin
 * and redirects to the dashboard if they are not.
 */
export const useRedirectIfNotAdmin = () => {
    const navigate = useNavigate();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading) {
            if (!user || !user.is_admin) {
                console.log("redirected to dashboard as not admin");
                navigate('/dashboard');
            }
        }
    }, [user, loading, navigate]);
};