import { useEffect, useState } from 'react';
import { getAllUsers } from '../services/authService';
import { getErrorMessage } from '../services/api';

// loads the list of users for the "assigned to" dropdown
export default function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    getAllUsers()
      .then((data) => !cancelled && setUsers(data))
      .catch((err) => !cancelled && setError(getErrorMessage(err)))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  return { users, loading, error };
}
