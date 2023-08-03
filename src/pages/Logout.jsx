import { useDispatch } from 'react-redux';
import { logoutUser } from '../reducers/authSlice';

function LogoutPage() {
  
  const dispatch = useDispatch();

  localStorage.removeItem('token');
  dispatch(logoutUser());
  
  return (
    <p style={{ textAlign: 'center'}}>You have successfully logged out</p>
  )
}

export default LogoutPage;
