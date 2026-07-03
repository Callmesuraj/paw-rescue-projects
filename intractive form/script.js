const form = document.getElementById('volunteerForm');
const successPanel = document.getElementById('successPanel');
const resetBtn = document.getElementById('resetBtn');

const fields = {
  fullName: {
    input: document.getElementById('fullName'),
    error: document.getElementById('fullNameError'),
    validate: (value) => {
      if (!value.trim()) return 'Please enter your name.';
      if (value.trim().length < 2) return 'Name looks too short.';
      return '';
    },
  },
  email: {
    input: document.getElementById('email'),
    error: document.getElementById('emailError'),
    validate: (value) => {
      if (!value.trim()) return 'Please enter your email.';
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value.trim())) return 'Enter a valid email address.';
      return '';
    },
  },
  phone: {
    input: document.getElementById('phone'),
    error: document.getElementById('phoneError'),
    validate: (value) => {
      const digitsOnly = value.replace(/\D/g, '');
      if (!digitsOnly) return 'Please enter your phone number.';
      if (digitsOnly.length !== 10) return 'Enter a valid 10-digit number.';
      return '';
    },
  },
  password: {
    input: document.getElementById('password'),
    error: document.getElementById('passwordError'),
    validate: (value) => {
      if (!value) return 'Please create a password.';
      if (value.length < 8) return 'Use at least 8 characters.';
      const hasLetter = /[A-Za-z]/.test(value);
      const hasNumber = /[0-9]/.test(value);
      if (!hasLetter || !hasNumber) return 'Include at least one letter and one number.';
      return '';
    },
  },
};

// ===== Real-time validation on input =====
Object.entries(fields).forEach(([key, field]) => {
  field.input.addEventListener('input', () => {
    validateField(key);
    if (key === 'password') updateStrengthMeter(field.input.value);
  });

  // Validate on blur too, so errors show even if user leaves an empty field
  field.input.addEventListener('blur', () => {
    validateField(key);
  });

  // Clear the "invalid" visual state immediately on focus for a calmer feel
  field.input.addEventListener('focus', () => {
    const wrapper = field.input.closest('.field');
    wrapper.classList.remove('field--invalid');
  });
});

function validateField(key) {
  const field = fields[key];
  const message = field.validate(field.input.value);
  const wrapper = field.input.closest('.field');

  if (message) {
    wrapper.classList.add('field--invalid');
    wrapper.classList.remove('field--valid');
    field.error.textContent = message;
  } else {
    wrapper.classList.remove('field--invalid');
    if (field.input.value.trim()) wrapper.classList.add('field--valid');
    field.error.textContent = '';
  }

  return !message;
}

// ===== Password strength meter =====
function updateStrengthMeter(value) {
  const meter = document.getElementById('strengthMeter');
  meter.classList.remove('is-weak', 'is-medium', 'is-strong');

  if (!value) return;

  let score = 0;
  if (value.length >= 8) score++;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
  if (/[0-9]/.test(value) && /[^A-Za-z0-9]/.test(value)) score++;

  if (score <= 1) meter.classList.add('is-weak');
  else if (score === 2) meter.classList.add('is-medium');
  else meter.classList.add('is-strong');
}

// ===== Show/hide password =====
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

togglePassword.addEventListener('click', () => {
  const isVisible = passwordInput.type === 'text';
  passwordInput.type = isVisible ? 'password' : 'text';
  togglePassword.setAttribute('aria-label', isVisible ? 'Show password' : 'Hide password');
});

// ===== Form submit =====
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const results = Object.keys(fields).map((key) => validateField(key));
  const allValid = results.every(Boolean);

  if (!allValid) {
    // Focus the first invalid field for accessibility
    const firstInvalidKey = Object.keys(fields).find(
      (key) => !fields[key].validate(fields[key].input.value) === false
    );
    return;
  }

  // Simulate submission success
  form.hidden = true;
  successPanel.hidden = false;
});

// ===== Reset form =====
resetBtn.addEventListener('click', () => {
  form.reset();
  Object.values(fields).forEach((field) => {
    const wrapper = field.input.closest('.field');
    wrapper.classList.remove('field--invalid', 'field--valid');
    field.error.textContent = '';
  });
  document.getElementById('strengthMeter').classList.remove('is-weak', 'is-medium', 'is-strong');
  successPanel.hidden = true;
  form.hidden = false;
  fields.fullName.input.focus();
});