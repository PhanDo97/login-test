// Register page logic
const registerForm = document.getElementById('registerForm');
const registerBtn = document.getElementById('registerBtn');
const regUsernameInput = document.getElementById('regUsername');
const regPasswordInput = document.getElementById('regPassword');
const regConfirmPasswordInput = document.getElementById('regConfirmPassword');
const regEmailInput = document.getElementById('regEmail');
console.log('REGISTER endpoint:', API_CONFIG.ENDPOINTS.REGISTER);
async function handleRegister(event) {
    console.log('Register form submitted');
    event.preventDefault();
    const username = regUsernameInput.value.trim();
    const password = regPasswordInput.value.trim();
    const confirmPassword = regConfirmPasswordInput.value.trim();
    const email = regEmailInput.value.trim();

    if (!username || !password|| !confirmPassword  || !email) {
        showAlert('alertBox', 'Please fill in all required fields!', 'error');
        return;
    }
    if (password.length < 8) {
        showAlert('alertBox', 'Password must be at least 8 characters!', 'error');
        regPasswordInput.focus();
        return;
    }
    if (password !== confirmPassword) {
        showAlert('alertBox', 'Passwords do not match!', 'error');
        regConfirmPasswordInput.focus();
        return;
    }
    setButtonLoading(registerBtn, true, 'Registering...');
    hideAlert('alertBox');
    try {
        const result = await ApiService.register(username, email, password );
        if (result.success) {
            showAlert('alertBox', 'Registration successful! You can now log in.', 'success');
            registerForm.reset();
        } else {
            showAlert('alertBox', result.error, 'error');
        }
    } catch (error) {
        showAlert('alertBox', 'Registration failed. Please try again!', 'error');
    }
    setButtonLoading(registerBtn, false);
}

function handleInputChange() {
    hideAlert('alertBox');
}

if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
    regUsernameInput.addEventListener('input', handleInputChange);
    regPasswordInput.addEventListener('input', handleInputChange);
    regConfirmPasswordInput.addEventListener('input', handleInputChange);
    regEmailInput.addEventListener('input', handleInputChange);
}
