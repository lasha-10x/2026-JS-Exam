function getStorageItem(key, fallbackValue = null) {
  const storedValue = localStorage.getItem(key);

  if (storedValue === null) {
    return fallbackValue;
  }

  try {
    return JSON.parse(storedValue);
  } catch (error) {
    console.error(`Could not parse ${key}:`, error);
    return fallbackValue;
  }
}

function setStorageItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function removeStorageItem(key) {
  localStorage.removeItem(key);
}