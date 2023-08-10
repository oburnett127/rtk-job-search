import React, { useState, useEffect } from 'react';
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

            if(isLogin === 'login') {
                dispatch(loginUser(authData));
            } else {
                //console.log("line 2");

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

                dispatch(registerUser(authData));
            }
        } catch(err) {
            console.log(err);
        }
    };

    const handleToggleMode = () => {
        setMessage('');
        if(isLogin === 'login') setIsLogin('signup');
        else setIsLogin('login');
    }
 
    return (
            <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
                <h1>{isLogin === 'login' ? 'Log in' : 'Create a new user'}</h1>
                <p>{message}</p>
                <p>{authStatus === 'loading' ? 'Loading...' : authError}</p>
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
