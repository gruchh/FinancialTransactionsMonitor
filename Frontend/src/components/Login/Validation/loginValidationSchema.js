export const isValidLogin = (username) => {
  const emailRegex = /\S+@\S+\.\S+/;
  const usernameRegex = /^[a-zA-Z0-9_.-]{3,}$/;
  return emailRegex.test(username) || usernameRegex.test(username);
};

export const isValidPassword = (password, minLength = 3) => {
  return password && password.length >= minLength;
};

export const validateLoginForm = (formData) => {
  const errors = {};

  if (!formData.username) {
    errors.username = "Login jest wymagany";
  } else if (!isValidLogin(formData.username)) {
    errors.username = "Nieprawidłowy format loginu (email lub nazwa użytkownika)";
  }

  if (!formData.password) {
    errors.password = "Hasło jest wymagane";
  } else if (!isValidPassword(formData.password, 3)) {
    errors.password = "Hasło musi mieć minimum 3 znaki";
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};