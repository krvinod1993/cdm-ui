import { useAuth } from '../../../shared/contexts/AuthContext.tsx';

function AuthModal() {
  const { isAuthOpen } = useAuth();

  if (!isAuthOpen) {
    return null;
  }

  return <div>Auth Modal</div>;
}

export default AuthModal;
