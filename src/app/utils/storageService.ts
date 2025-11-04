class SecureStorage {
  key: string;

  constructor(key: string) {
    this.key = key;
  }

  setValue = (value: string, expiresIn?: number) => {
    if (typeof window === 'undefined') return;
    const item = {
      value,
      expires: expiresIn ? Date.now() + expiresIn * 1000 : null,
    };
    localStorage.setItem(this.key, JSON.stringify(item));
  };

  getValue = (): string | null => {
    if (typeof window === 'undefined') return null;
    const itemStr = localStorage.getItem(this.key);
    if (!itemStr) return null;
    if (!itemStr.startsWith('{') || !itemStr.endsWith('}')) {
      return itemStr;
    }
    try {
      const item = JSON.parse(itemStr);
      if (item.expires && Date.now() > item.expires) {
        this.clear();
        return null;
      }
      return item.value;
    } catch {
      console.error(`Error parsing JSON from localStorage for key "${this.key}":`, itemStr);
      return itemStr;
    }
  };

  clear = () => {
    localStorage.removeItem(this.key);
  };
}

export const StorageService = {
  authToken: new SecureStorage('authToken'),
  mobileNumber: new SecureStorage('mobileNumber'),
  otp: new SecureStorage('otp'),
  PageTitle: new SecureStorage('PageTitle'),
  LookUpValues: new SecureStorage('LookUpValues'),
  organizationId: new SecureStorage('organizersId'),

  clearAll: () => {
    localStorage.clear();
  },
};

export const logout = (redirectToLogin = true) => {
  if (typeof window === 'undefined') return;
  StorageService.clearAll();
  if (redirectToLogin && typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};

const isAuthenticated = (): boolean => {
  const token = StorageService.authToken.getValue();
  return !!token;
};
