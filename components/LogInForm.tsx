import React, { useState, useContext, SetStateAction, Dispatch } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '../contexts/AuthContext';
import { getUserService } from '../services/internalApi';
import TextField from '@material-ui/core/TextField';
import Card from '../components/Card'
import FormControlElement from '../interfaces/FormControlElement';
import  Link from 'next/link'

const initialState = {
  email: '',
  password: '',
  error: '',
}

interface Props {
  setLogin: Dispatch<SetStateAction<boolean>>
}

function LogInForm({ setLogin }: Props) {
  const authorized = useContext(AuthContext);
  if (!authorized) return null;
  const { logIn, setEmail, setUsername } = authorized;
  const router = useRouter();
  const [user, setUser] = useState(initialState)

  const handleLogIn = async (e: React.MouseEvent<HTMLElement>):Promise<void>  => {
    e.preventDefault();
    try {
      setUser({ ...user, error: '' })
      await logIn(user.email, user.password);
      setEmail(user.email);
      const username = await getUserService(user.email)
      setUsername(username[0].username)
      router.push('/discover');
    } catch (err) {
      setUser({ ...user, error: err.message});
    }
  }

  function handleChange(e: React.ChangeEvent<FormControlElement>) : void {
    const target = e.target as FormControlElement;
    const { name, value } = target;
    setUser({ ...user, [name]: value})
  }

  return (
    <div className="front">
    <Card>
        <h2>Log In</h2>
          <form className="form-control" data-testid="form">
          {user.error && <p>{user.error}</p>}
          <>
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
          </>
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
            onClick={handleLogIn}
          >
            Log In
          </button>
        </form>
          <a onClick={() => setLogin(true)}>
            Don&apos;t have an account? Sign Up
          </a>
    </Card>
    </div>
  );
}

export default LogInForm;
