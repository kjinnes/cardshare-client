import React, { useState, useContext, Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '../contexts/AuthContext';
import Card from '../components/Card'
import  { signUpService } from '../services/internalApi';
import TextField from '@material-ui/core/TextField';
import FormControlElement from '../interfaces/FormControlElement';

const initialState = {
  username: '',
  email: '',
  password: '',
  error: '',
}

interface Props {
  setLogin: Dispatch<SetStateAction<boolean>>
}

const SignUpForm = ({setLogin}: Props) => {
  const [user, setUser] = useState(initialState)
  const router = useRouter();
  const auth = useContext(AuthContext);
  if (!auth) return null;

  const { signUp, setEmail, setUsername } = auth;

  const handleSignUp = async (e: React.MouseEvent<HTMLElement>): Promise<void> => {
    e.preventDefault();
    try {
      setUser({ ...user, error: '' })
      await signUp(user.email, user.password)
      await signUpService({ username: user.username, email: user.email })
      setUsername(user.username)
      setEmail(user.email)
      router.push('/discover');
    } catch (error) {
      setUser({ ...user, error: error.message })
    }
  }

  const handleChange = (e: React.FormEvent<FormControlElement>) => {
    const target = e.target as FormControlElement;
    const {name, value} = target;
    setUser({
      ...user,
      [name]: value,
    })
  }

  return (
    <div className="back">
    <Card>
      <h2>Sign Up</h2>
      <form className="form-control" data-testid="form">
        {user.error && <p>{user.error}</p>}
        <TextField
          className="textfield"
          autoComplete="off"
          type="text"
          name="username"
          value={user.username}
          onChange={handleChange}
          label="Username"
          required
        />
        <TextField
          className="textfield"
          autoComplete="off"
          type="email"
          label="Email"
          name="email"
          value={user.email}
          onChange={handleChange}
          required
        />

        <>
          <TextField
            className="textfield"
            autoComplete="off"
            type="password"
            name="password"
            label="Password"
            value={user.password}
            onChange={handleChange}
            required
          />
        </>
        <button
          name="signup"
          className="saveButton"
          type="submit"
          onClick={handleSignUp}
        >
          Sign Up
        </button>
      </form>
      <a onClick={() => setLogin(false)}>Already have an account? Log In</a>
    </Card>
    </div>
  );
}

export default SignUpForm
