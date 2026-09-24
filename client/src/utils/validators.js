const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const validateEmail = (email) => {
  if (!email.trim()) return 'Email is required';
  if (!EMAIL_REGEX.test(email.trim())) return 'Enter a valid email address';
  return '';
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[a-z]/.test(password)) return 'Add at least one lowercase letter';
  if (!/[A-Z]/.test(password)) return 'Add at least one uppercase letter';
  if (!/\d/.test(password)) return 'Add at least one number';
  if (!/[^A-Za-z0-9]/.test(password)) return 'Add at least one special character';
  return '';
};

export const validateName = (name) => {
  if (!name.trim()) return 'Name is required';
  if (name.trim().length < 2) return 'Name must be at least 2 characters';
  return '';
};

export const validateTask = (form) => {
  const errors = {};
  if (!form.title.trim()) errors.title = 'Title is required';
  else if (form.title.length > 100) errors.title = 'Title must be 100 characters or less';
  if (form.description.length > 1000) errors.description = 'Description must be 1000 characters or less';
  if (!form.dueDate) errors.dueDate = 'Pick a due date';
  if (!form.assignedTo) errors.assignedTo = 'Choose who this task is for';
  return errors;
};
