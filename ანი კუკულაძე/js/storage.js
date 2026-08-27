export function getStorageData(key, defaultValue) {
  const savedData = localStorage.getItem(key);

  if (!savedData) {
    return defaultValue;
  }

  return JSON.parse(savedData);
}

export function saveStorageData(key, data) {
  localStorage.setItem(
    key,
    JSON.stringify(data)
  );
}

export function removeStorageData(key) {
  localStorage.removeItem(key);
}