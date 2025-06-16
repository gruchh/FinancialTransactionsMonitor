export const isValidLogin = (username) => {
  const emailRegex = /\S+@\S+\.\S+/;
  const usernameRegex = /^[a-zA-Z0-9_.-]{3,}$/;
  return emailRegex.test(username) || usernameRegex.test(username);
};

export const isValidPassword = (password, minLength = 6) => {
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
  } else if (!isValidPassword(formData.password, 6)) {
    errors.password = "Hasło musi mieć minimum 6 znaków";
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};

export const loginValidationSchema = (formData) => {
  const errors = {};

  if (!formData.username) {
    errors.username = "Login jest wymagany";
  } else if (!isValidLogin(formData.username)) {
    errors.username = "Nieprawidłowy format loginu (email lub nazwa użytkownika)";
  }

  if (!formData.password) {
    errors.password = "Hasło jest wymagane";
  } else if (!isValidPassword(formData.password, 8)) {
    errors.password = "Hasło musi mieć minimum 8 znaków";
  }

  if (!formData.confirmPassword) {
    errors.confirmPassword = "Potwierdzenie hasła jest wymagane";
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "Hasła nie są identyczne";
  }

  if (!formData.name) {
    errors.name = "Imię jest wymagane";
  } else if (formData.name.length < 2) {
    errors.name = "Imię musi mieć minimum 2 znaki";
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};