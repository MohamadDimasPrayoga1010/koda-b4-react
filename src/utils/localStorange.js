const STORAGE_KEYS = {
  USER: "user",
  USERS: "users",
  TOKEN: "token",
  IS_LOGGED_IN: "isLoggedIn",
};

const getFromLocalStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error getting ${key} from localStorage:`, error);
    return null;
  }
};

const setToLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting ${key} to localStorage:`, error);
    return false;
  }
};

const checkUserExists = (email) => {
  const users = getFromLocalStorage(STORAGE_KEYS.USERS) || [];
  return users.some((user) => user.email === email);
};

export const saveUser = (userData) => {
  const users = getFromLocalStorage(STORAGE_KEYS.USERS) || [];

  if (checkUserExists(userData.email)) {
    return { success: false, message: "Email already registered" };
  }

  const newUser = {
    id: Date.now(),
    fullName: userData.fullName,
    email: userData.email,
    password: userData.password,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  setToLocalStorage(STORAGE_KEYS.USERS, users);

  return { success: true, message: "Registration successful", user: newUser };
};

const saveCurrentUser = (user) => {
  setToLocalStorage(STORAGE_KEYS.USER, user);
  setToLocalStorage(STORAGE_KEYS.IS_LOGGED_IN, true);
};

export const loginUser = (email, password) => {
  const users = getFromLocalStorage(STORAGE_KEYS.USERS) || [];

  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());


  if (!user) {
    return {
      success: false,
      message: "Email not registered. Please register first.",
    };
  }

  if (user.password !== password) {
    return {
      success: false,
      message: "Invalid password. Please try again.",
    };
  }


  const userWithoutPassword = {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    createdAt: user.createdAt,
  };

  saveCurrentUser(userWithoutPassword);

  return {
    success: true,
    message: "Login successful!",
    user: userWithoutPassword,
  };
};

export default STORAGE_KEYS;
