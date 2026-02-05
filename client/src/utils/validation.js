export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  const result = {
    isValid: false,
    message: '',
    strength: 'weak',
  };

  if (!password) {
    result.message = 'Password is required';
    return result;
  }

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isLongEnough = password.length >= 8;

  if (!isLongEnough) {
    result.message = 'Password must be at least 8 characters';
    return result;
  }

  if (!hasUppercase) {
    result.message = 'Password must contain at least one uppercase letter';
    return result;
  }

  if (!hasLowercase) {
    result.message = 'Password must contain at least one lowercase letter';
    return result;
  }

  if (!hasNumber) {
    result.message = 'Password must contain at least one number';
    return result;
  }

  if (!hasSpecial) {
    result.message = 'Password must contain at least one special character';
    return result;
  }

  result.isValid = true;
  result.message = 'Strong password';
  result.strength = 'strong';
  
  return result;
};

export const validateLoginForm = (data) => {
  const errors = {};

  if (isEmpty(data.email)) {
    errors.email = 'Email is required';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (isEmpty(data.password)) {
    errors.password = 'Password is required';
  } else if (data.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateRegisterForm = (data) => {
  const errors = {};

  if (isEmpty(data.name)) {
    errors.name = 'Name is required';
  } else if (!validateName(data.name)) {
    errors.name = 'Please enter a valid name';
  }

  if (isEmpty(data.email)) {
    errors.email = 'Email is required';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.message;
  }

  if (isEmpty(data.confirmPassword)) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateName = (name) => {
  if (!name || name.trim().length < 2) {
    return false;
  }
  
  const nameRegex = /^[a-zA-Z\s'-]+$/;
  return nameRegex.test(name.trim());
};

export const isEmpty = (str) => {
  return !str || str.trim().length === 0;
};