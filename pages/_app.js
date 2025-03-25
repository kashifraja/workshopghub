import '../styles/globals.css';
// Removed the import for theme.css as it is no longer needed



import { UserProvider } from '../context/UserContext'; // Importing the UserProvider

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default MyApp;
