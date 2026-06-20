import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

export default function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const response = await API.post('/api/auth/register', { firstName, lastName, email, password, role });
      setSuccess(response.data.data?.message || 'Registered successfully.');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container card auth-card">
      <h1>Signup</h1>
      <p>Create your Sajiri account to start shopping.</p>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor="firstName">First Name</label>
        <input id="firstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />

        <label htmlFor="lastName">Last Name</label>
        <input id="lastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />

        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label htmlFor="password">Password</label>
        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <label htmlFor="role">Role</label>
        <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="user">User</option>
          <option value="owner">Owner</option>
        </select>

        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-success">{success}</div>}
        <button className="btn" type="submit" disabled={loading}>{loading ? 'Creating account...' : 'Signup'}</button>
      </form>
      <p className="auth-footer">Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}
