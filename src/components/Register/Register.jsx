import React, { useState } from 'react';
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, updateProfile } from "firebase/auth";
import app from '../../Firebase/firebase.config';
import { Link } from 'react-router-dom';

const auth = getAuth(app);

const Register = () => {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const sendVerificationEmail = (user) => {
        sendEmailVerification(result.user)
        .then(result => {
            console.log(result);
            alert('Please verify your email address');
        })
    }

    const updateUserData = (name) => {
        updateProfile(user, {
            displayName: name
        })
        .then(() => {
            console.log('User name updated');
        })
        .catch(error => {
            setError(error.message);
        })
    }

    const handleEmailChange = (event) => {
        console.log(event.target.value);
    }

    const handlePasswordBlur = (event) => {
        console.log(event.target.value);
    }

    const handleSubmit = (event) => {
        // Step 01: Prevent page refresh
        event.preventDefault();
        setSuccess('');
        setError('');

        // Step 02: Collect from data
        const email = event.target.email.value;
        const password = event.target.email.password;
        const name = event.target.name.value;
        console.log(name, email, password);

        // Validate password
        if (!/(?=.*[A-Z])/.test(password)) {
            setError('Please add at least one uppercase');
            return;
        }
        else if (!/(?=.*[!@#$&*])/.test(password)) {
            setError('Please add at least a special character');
            return;
        }
        else if (!/(?=.*[0-9].*[0-9])/.test(password)) {
            setError('Please add at least two numbers');
            return;
        }
        else if(password.length < 8) {
            setError('Please add least 8 characters in your password');
            return;
        }

        // Step 03: Create user in firebase
        createUserWithEmailAndPassword(auth, email, password)
            .then(result => {
                const loggedUser = result.user;
                console.log(loggedUser);
                setError('');
                event.target.reset();
                setSuccess("User has been created successfully");
                sendVerificationEmail(user);
                updateUserData(result.user, name);
            })
            .catch(error => {
                console.error(error.message);
                setError(error.message);
            })
    }

    return (
        <div className='w-50 mx-auto mt-4'>
            <h4 className='w-50 text-center text-primary'>Please Register</h4>
            <form onSubmit={handleSubmit}>
                <input className='w-50 mb-4 px-2 py-2 rounded ps-2' type="text" name="name" id="name" placeholder='Your Name' required /> <br />
                <input className='w-50 mb-4 px-2 py-2 rounded ps-2' onChange={handleEmailChange} type="email" name="email" id="email" placeholder='Your Email' required /> <br />
                <input className='w-50 mb-4 px-2 py-2 rounded ps-2' onBlur={handlePasswordBlur} type="password" name="password" id="password" placeholder='Your Password' required /> <br />
                <input className='btn btn-primary mb-4' type="submit" value="Register" />
            </form>
            <p><small>Already have an account? Please <Link to="/login">Login</Link></small></p>
            <p className='text-danger'>{error}</p>
            <p className='text-success'>{success}</p>
        </div>
    );
};

export default Register;