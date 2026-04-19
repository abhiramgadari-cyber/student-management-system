# Login & Authentication System

## Overview

Complete authentication system with login, registration, and session management.

## Features

✅ **Login Page**
- Email/Password authentication
- Remember me functionality
- Demo credentials for testing
- Forgot password link
- Link to registration

✅ **Registration Page**
- Full name, email, password validation
- Password confirmation
- Terms & Conditions acceptance
- Auto-login after registration

✅ **Authentication**
- Session management with localStorage
- Auto-redirect to login if not authenticated
- User greeting in dashboard
- Logout functionality
- Password visibility toggle

## Files

```
├── login.html           - Login page
├── register.html        - Registration page
├── auth.js              - Authentication logic
├── index.html           - Updated with auth checks
├── script.js            - Updated with user greeting
└── style.css            - Updated with auth styles
```

## How It Works

### Login Flow

1. User opens `login.html`
2. Enters email and password
3. System checks against registered users or demo account
4. If valid, creates session and redirects to dashboard
5. Dashboard checks for active session

### Registration Flow

1. User clicks "Register here" link
2. Fills registration form
3. System validates all fields
4. Creates new user account
5. Auto-logs in user
6. Redirects to dashboard

### Session Management

- User data stored in localStorage as `currentUser`
- Automatic redirect if session invalid
- Logout clears session data

## Default Demo Account

```
Email: demo@example.com
Password: password123
```

## User Registration

Users can create new accounts via registration page:
- Accounts stored in localStorage (can migrate to database)
- Passwords stored in plain text (use hashing in production!)
- Email must be unique

## API Integration (Optional)

To use with backend API, modify `auth.js` to call:

```javascript
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
GET /api/auth/verify
```

## Security Notes

### Current (Development)
- Passwords stored in plain text (localStorage)
- No encryption
- Frontend validation only

### Production Recommendations
1. Use proper backend authentication
2. Hash passwords with bcrypt
3. Use JWT tokens
4. HTTPS only
5. Implement rate limiting
6. Add email verification
7. Implement proper password reset

## Customization

### Change Demo Credentials

Edit `auth.js`:
```javascript
if (email === 'demo@example.com' && password === 'password123') {
    // Change these values
}
```

### Change Page Titles

Edit `login.html` and `register.html` title tags

### Modify Validation Rules

In `auth.js`, update validation functions:
- `handleLogin()` - Login validation
- `handleRegister()` - Registration validation

## User Experience

### Login Page
- Clean, modern design
- Demo credentials shown
- Password visibility toggle
- Remember me checkbox
- Forgot password option
- Link to registration

### Registration Page
- Step-by-step form
- Password strength hints
- Password confirmation
- Terms acceptance required
- Link back to login

### Dashboard
- User greeting in header
- Logout button in top right
- Session persists on refresh
- Auto-redirect on invalid session

## Testing

### Test Scenarios

1. **Demo Login**
   - Use demo@example.com / password123
   - Should redirect to dashboard

2. **Register New Account**
   - Create new account
   - Should auto-login
   - Should redirect to dashboard

3. **Session Persistence**
   - Login
   - Refresh page
   - Should stay logged in

4. **Logout**
   - Click logout button
   - Should redirect to login

5. **Invalid Credentials**
   - Try wrong password
   - Should show error

## Troubleshooting

**"Password field not showing"**
- Check browser console for errors
- Ensure auth.js is loaded

**"Can't login"**
- Use demo credentials for testing
- Check localStorage quota
- Clear browser cache

**"Session not persisting"**
- Check if localStorage is enabled
- Try different browser

**"Auto-logout"**
- Check if localStorage is cleared
- Try refreshing page

## Data Storage

### LocalStorage Keys

```
currentUser      - Currently logged in user
users            - Array of all registered users
rememberMe       - Remember me preference
students         - Student data (from main app)
```

### User Object Structure

```javascript
{
    id: "user-timestamp",
    name: "User Name",
    email: "user@email.com",
    loginTime: "4/19/2026, 10:30:45 AM"
}
```

## Future Enhancements

- [ ] Email verification
- [ ] Social login (Google, GitHub)
- [ ] Two-factor authentication
- [ ] Password reset email
- [ ] User profile page
- [ ] Change password feature
- [ ] Account deactivation
- [ ] Login history
- [ ] Session timeout
- [ ] Remember device option

---

**Version:** 1.0  
**Last Updated:** 2024
