import { getAuth, sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useRef, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import app from '../../Firebase/firebase.config';
import { Link } from 'react-router-dom';

const auth = getAuth(app);

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const emailRef = useRef();

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.target;
        const email = form.email.value;
        const password = form.password.value;
        console.log(`Email: ${email}, Password: ${password}`);
        setSuccess('');
        setError('');

        // Validate password
        if (!/(?=.*[A-Z].*[A-Z])/.test(password)) {
            setError('Please add at least two uppercases');
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
        else if (password.length < 8) {
            setError('Please add least 8 characters in your password');
            return;
        }

        signInWithEmailAndPassword(auth, email, password)
        .then(result => {
            const loggedUser = result.user;
            console.log(loggedUser);
            if(!loggedUser.emailVerified)
            setSuccess('User Login Successful');
            setError('');
        })
        .catch(error => {
            setError(error.message);
        })
    };

    const handleResetPassword = (event) => {
        const email = emailRef.current.value;
        if(!email) {
            alert('Please provide your email address to reset password');
        }
        sendPasswordResetEmail(auth, email)
        .then( () => {
            alert('Please check your email');
            return;
        })
        .catch(error => {
            console.log(error);
            setError(error.message);
        })
    }

    return (
        <div className='w-25 mx-auto'>
            <h2 className='text-center text-primary mt-3'>Please Login</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control className='mb-4 px-3 py-3'
                        type="email"
                        name="email"
                        placeholder="Enter email"
                        value={email}
                        ref={emailRef}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control className='mb-4 px-3 py-3'
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>

                <Button className='mb-4' variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
            <p><small>Forget Password? Please <button onClick={handleResetPassword} className='btn btn-link'>Reset Password</button></small></p>
            <p><small>New to this website? Please <Link to="/register">Register</Link></small></p>
            <p className='text-danger'>{error}</p>
            <p className='text-success'>{success}</p>
        </div>

    );
}

export default Login;
