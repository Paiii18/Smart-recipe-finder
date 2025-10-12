import useAuthStore from '../store/authStore';

export const testAuthStore = () => {
  console.log('🧪 Testing Auth Store...');
  
  // Get store instance
  const store = useAuthStore.getState();
  
  console.log('✅ Initial state:', {
    isAuthenticated: store.isAuthenticated,
    user: store.user,
    isLoading: store.isLoading,
  });
  
  // Test methods exist
  console.log('✅ Methods available:', {
    login: typeof store.login,
    register: typeof store.register,
    logout: typeof store.logout,
    getCurrentUser: typeof store.getCurrentUser,
  });
  
  return true;
};