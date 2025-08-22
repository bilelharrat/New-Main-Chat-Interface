// Simple API utilities for Eden AI Interface
export const api = {
  testConnection: async () => {
    try {
      const response = await fetch('http://localhost:8000/health');
      if (response.ok) {
        return { status: 'connected', message: 'Backend connected successfully' };
      } else {
        return { status: 'disconnected', message: 'Backend responded but with error' };
      }
    } catch (error) {
      return { status: 'error', message: 'Backend connection failed' };
    }
  }
};
