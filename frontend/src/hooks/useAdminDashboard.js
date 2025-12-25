// src/hooks/useAdminDashboard.js
import { useState, useEffect, useCallback } from 'react';
import { adminAPI } from '../api/adminAPI';

export const useAdminDashboard = () => {
  const [data, setData] = useState({
    summary: {
      totalBookings: 0,
      totalConfirmed: 0,
      totalRevenue: 0,
      totalUsers: 0,
      totalShips: 0,
    },
    recentBookings: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminAPI.getDashboard();
      setData(response);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return { data, loading, error, refetch: fetchDashboard };
};