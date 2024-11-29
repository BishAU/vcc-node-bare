import React from 'react';
import { UserManagement } from '../../components/admin/UserManagement';
import { PageLayout } from '../../components/layout/PageLayout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole, AuthContextType } from '../../types/user';

const Users: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth() as AuthContextType;

  React.useEffect(() => {
    // Redirect non-admin users
    if (user && user.role !== UserRole.ADMIN) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  if (!user || user.role !== UserRole.ADMIN) {
    return null;
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4">
        <UserManagement />
      </div>
    </PageLayout>
  );
};

export default Users;
