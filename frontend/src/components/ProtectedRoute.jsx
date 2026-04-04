import React from 'react';
import { Navigate } from 'react-router-dom';

const TOKEN_KEY = 'lvv_token';

function isTokenValid(token) {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!isTokenValid(token)) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
