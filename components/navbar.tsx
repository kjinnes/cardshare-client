import React, { useState, useContext, useEffect } from 'react';
import Link from 'next/link';
import { AuthContext } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import { getUserService } from '../services/internalApi'

const Navbar = () => {
  const context = useContext(AuthContext);
  if (!context) return null;
  const { signOut, currentUser, setEmail, email, setUsername } = context;
  let loggedIn: boolean
  if (currentUser.email !== "waiting...") {
    loggedIn = true;
  } else loggedIn = false;

  const [error, setError] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    if (currentUser.email !== email) setEmail(currentUser.email)

    const getUsername = async () => {
      if (loggedIn && currentUser.email) {
        let username = await getUserService(currentUser.email)
        if (username && username[0]) setUsername(username[0].username)
      } else {
        setUsername('')
        setEmail('')
      }
    }
    getUsername();
  },[currentUser])

  console.log(context)

  const handleSignOut = async (e: React.MouseEvent<HTMLElement, MouseEvent>): Promise<any> => {
    try {
      setError('');
      await signOut();
      await setUsername('')
      await setEmail('')
      loggedIn = false;
      router.push('/');
    } catch (err) {
      setError("Signout Failed.");
    }
  }

  return (
    <>
    <nav className="nav">
      <Link href="/"><a><h1>Cardshare</h1></a></Link>
      <ul>
        <li className="navButton">
          <Link href="/discover">
            <a>Discover</a>
          </Link>
        </li>
        {email && <li className="navButton">
          <Link href="/mydecks">
            <a>My Decks</a>
          </Link>
        </li>}
        {email && <li className="navButton">
          <Link href="/study">
            <a >Study</a>
          </Link>
        </li>}
        <li className="navButton">
          {loggedIn ? (
            <a
              onClick={handleSignOut}
            >Sign Out</a>
          ) : (
            <Link href='/'><a>Log In</a></Link>
          )}
        </li>
      </ul>
    </nav>
    <p>{error && error}</p>
    </>
  );
}

export default Navbar;
