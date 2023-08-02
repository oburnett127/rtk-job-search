import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser, fetchEmployerList, selectEmployerList } from '../reducers/authSlice'
import classes from './AuthForm.module.css';
  
function AuthForm() {
    const [isLogin, setIsLogin] = useState('login');
    const [isEmployer, setIsEmployer] = useState(false);
    const [message, setMessage] = useState('');
    const [employerName, setEmployerName] = useState(localStorage.getItem('employerName') || '');
    const authStatus = useSelector((state) => state.auth.status);
    const authError = useSelector((state) => state.auth.error);

    const { register, handleSubmit } = useForm();

    const dispatch = useDispatch();
    const employerList = useSelector(selectEmployerList);

    useEffect(() => {
        dispatch(fetchEmployerList());
      }, [dispatch]);

    const options = employerList.map((employer) => (
        <option key={employer.id} value={JSON.stringify(employer)}>
          {employer.name}
        </option>
      ));
    
    useEffect(() => {
        localStorage.setItem('employerName', employerName);
    }, [employerName]);

    const onSubmit = (data) => {
        try {
            setMessage('');
            //console.log("line 1");

            let authData = {
                email: data.email,
                password: data.password
            };

            let url = '';

            if(isLogin === 'login') {
                url = process.env.REACT_APP_SERVER_URL + '/auth/login';
            } else {
                url = process.env.REACT_APP_SERVER_URL + '/auth/signup';

                console.log("line 2");

                if(isEmployer) {
                    let empJson = '';
                    //console.log("employerName: " + employerName);

                    if(data.compName === '' && data.employerSelect === '' ) {
                        setMessage('You must either select an employer name or enter a new employer name.');
                        throw new Error('The user must enter an employer name.');
                    }

                    if(data.employerSelect !== '') {
                        empJson = JSON.parse(data.employerSelect);
                        //console.log("selectedOptionName: " + empJson['name']);

                        if(data.compName === '') {
                            setEmployerName(empJson['name']);
                        } else {
                            setEmployerName(data.compName);
                        }
                    }

                    authData = {
                        email: data.email,
                        password: data.password,
                        isEmployer: true,
                        employerName: data.compName === '' ? empJson['name'] : employerName
                    };
                   
                    //console.log("employer name: " + employerName);
                } else {
                    authData = {
                        email: data.email,
                        password: data.password,
                        isEmployer: false
                    };
                }
            }

            //console.log("line 6");
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(authData),
            });

            if (isLogin !== 'login' && response.status === 409) {
                //console.log("line 8");
                setMessage('The email address you entered is already taken. Please enter a different email.');
                throw new Error('The email address you entered is already taken. Please enter a different email.');
            }

            //console.log("isLogin: " + isLogin);
            //console.log("response.status: " + response.status);

            if (!response.ok) {
                //console.log("line 9");
                setMessage('Log in or registration failed');
                throw new Error('Could not authenticate user.');
            }

            const resData = await response.json();
            
            const token = resData.token;

            localStorage.setItem('token', token);
            const expiration = new Date();
            expiration.setHours(expiration.getHours() + 2);
            localStorage.setItem('expiration', expiration.toISOString());

            setMessage('Log in or sign up was successful');
            setIsLoggedIn(true);

            try {
                const response = await fetch(process.env.REACT_APP_SERVER_URL + `/auth/getuser/${data.email}`);
                const user = await response.json();
                setUser(user);
                console.log("userId is: " + user.id);
            } catch (error) {
                if (error.response) {
                    console.log(error.response);
                } else if (error.request) {
                    console.log("network error");
                } else {
                    console.log(error);
                }
            }
        } catch(err) {
            //console.log("line 10");
            console.log(err);
        }
    };

    const handleToggleMode = () => {
        setMessage('');
        if(isLogin === 'login') setIsLogin('signup');
        else setIsLogin('login');
    }
 
    return (
            <form className={classes.form} errors={errors} onSubmit={handleSubmit(onSubmit)}>
                <h1>{isLogin === 'login' ? 'Log in' : 'Create a new user'}</h1>
                <p>{message}</p>
                <p>
                    <label htmlFor="email">Email</label>
                    <input type="email" {...register("email", {required: true})} />
                </p>
                <p>
                    <label htmlFor="password">Password</label>
                    <input type="password" {...register("password", {required: true})} />
                </p>
                {isLogin === 'signup' && (
                    <div className="radio-container">
                        <label htmlFor="user" style={{ display: 'inline-block', padding: '0px 1em 0px 8px' }}>
                            Job Seeker<input type="radio"  {...register("user")} checked={!isEmployer}  value="user" onChange={() => setIsEmployer(false)} />
                        </label>
                        <label htmlFor="employer" style={{ display: 'inline-block', padding: '0px 1em 0px 8px' }}>
                            Employer<input type="radio" {...register("employer")} checked={isEmployer}  value="employer" onChange={() => setIsEmployer(true)} />
                        </label>
                    </div>
                )}
                {isLogin === 'signup' && isEmployer === true && (
                    <div>
                        <label htmlFor="employerSelect">Select Employer Name</label>
                        <select name="employerSel" {...register("employerSelect")}>{options}</select>
                        <p>If you do not see your company's name in the drop down list  
                            you can type it in the box below to have it added to the list.</p>
                        <div>
                            <label htmlFor="compName">Add employer name:</label>
                            <input type="text" {...register("compName")} onChange={(e) => setEmployerName(e.target.value)} />
                        </div>
                    </div>
                )}
                <div className={classes.actions}>
                    <Link to={'/auth'} onClick={handleToggleMode}>
                        {isLogin === 'login' ? 'Create new user' : 'Login'}
                    </Link>
                    <button type="submit">Submit</button>
                </div>
            </form>
    );
}
  
export default AuthForm;

// if(data.compName === '' && data.employerSelect === '' ) {
//     setMessage('You must either select an employer name or enter a new employer name.');
//     throw new Error('The user must enter an employer name.');
// }
