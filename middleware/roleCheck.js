import { getSession } from 'next-auth/react'; // Importing session management

export const roleCheck = (allowedRoles) => {
  return async (req, res, next) => {
    const session = await getSession({ req }); // Get the session from the request
    if (!session || !allowedRoles.includes(session.user.role)) {
      return res.status(403).json({ error: 'Access denied' }); // Deny access if role is not allowed
    }
    next(); // Proceed to the next middleware or route handler
  };
};
