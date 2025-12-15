import { useCallback, useEffect, useState } from "react";

export type UseLocalStorageType = {
  value: string | null;
  setLocalStorageItem: (value: string) => void;
  removeLocalStorageItem: () => void;
};

export default function useLocalStorage(key: string): UseLocalStorageType {
  const [value, setValue] = useState<string | null>(localStorage.getItem(key));

  const setLocalStorageItem = useCallback(
    (value: string) => {
      setValue(value);
      localStorage.setItem(key, value);
    },
    [key]
  );

  const removeLocalStorageItem = useCallback(() => {
    setValue(null);
    localStorage.removeItem(key);
  }, [key]);

  useEffect(
    function () {
      const val = localStorage.getItem(key);
      if (val) setValue(val);
    },
    [key]
  );

  return {
    value,
    setLocalStorageItem,
    removeLocalStorageItem,
  };
}
