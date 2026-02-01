export const validators = {
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isValidPassword: (password: string): boolean => {
    return password.length >= 8;
  },

  isValidBirthDate: (date: string): boolean => {
    const d = new Date(date);
    return d instanceof Date && !isNaN(d.getTime());
  },

  isValidTime: (time: string): boolean => {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  },

  isValidLocation: (location: string): boolean => {
    return location.trim().length >= 2;
  },

  validateBirthData: (data: any): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    if (!validators.isValidBirthDate(data.date)) errors.push('Invalid birth date');
    if (!validators.isValidTime(data.time)) errors.push('Invalid birth time');
    if (!validators.isValidLocation(data.location)) errors.push('Invalid location');
    return { valid: errors.length === 0, errors };
  },

  validateLoginForm: (email: string, password: string): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    if (!validators.isValidEmail(email)) errors.push('Invalid email address');
    if (!password) errors.push('Password is required');
    return { valid: errors.length === 0, errors };
  },

  validateRegisterForm: (email: string, password: string, name: string): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    if (!validators.isValidEmail(email)) errors.push('Invalid email address');
    if (!validators.isValidPassword(password)) errors.push('Password must be at least 8 characters');
    if (!name || name.trim().length < 2) errors.push('Name must be at least 2 characters');
    return { valid: errors.length === 0, errors };
  },
};
