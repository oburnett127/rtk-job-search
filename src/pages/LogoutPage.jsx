import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../reducers/authSlice';

function LogoutPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        dispatch(logoutUser());
        localStorage.removeItem('token');
      } catch (error) {
        console.log('Error logging out:', error.message);
      }
    };
  
    handleLogout();
  }, [dispatch]);
  

  return (
    <p style={{ textAlign: 'center'}}>You have successfully logged out</p>
  )
}

export default LogoutPage;
