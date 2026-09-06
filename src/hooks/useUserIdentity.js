import { useLocalStorage } from './useLocalStorage';

export function useUserIdentity() {
  const [user, setUser] = useLocalStorage('imposter_user_profile', () => {
    const randomId = 'user_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
    return {
      id: randomId,
      name: ''
    };
  });

  const safeUser = (typeof user === 'object' && user !== null && user.id)
    ? user
    : { id: 'user_' + Date.now().toString(36), name: typeof user === 'string' ? user : '' };

  const setUserName = (name, customId = null) => {
    setUser((prev) => {
      const prevId = (typeof prev === 'object' && prev !== null && prev.id) ? prev.id : null;
      return {
        id: customId || prevId || ('user_' + Date.now().toString(36)),
        name: (name || '').trim()
      };
    });
  };

  return {
    user: safeUser,
    setUserName
  };
}

