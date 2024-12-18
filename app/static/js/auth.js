
function switchTab(tab) {
    // Remove active class from all tabs and contents
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.content').forEach(c => c.classList.remove('active'));
    
    // Add active class to selected tab and content
    if (tab === 'login') {
        document.querySelector('.tab:first-child').classList.add('active');
        document.getElementById('login').classList.add('active');
    } else {
        document.querySelector('.tab:last-child').classList.add('active');
        document.getElementById('register').classList.add('active');
    }
}

async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Redirect to chat or handle successful login
            window.location.href = '/chat';
        } else {
            // Show error message
            document.getElementById('loginEmailError').textContent = data.message;
            document.getElementById('loginEmailError').style.display = 'block';
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function handleRegister(event) {
    event.preventDefault();
    
    const email = document.getElementById('registerEmail').value;
    const name = document.getElementById('registerName').value;
    const password = document.getElementById('registerPassword').value;
    const passwordConfirm = document.getElementById('registerPasswordConfirm').value;
    
    // Reset error messages
    document.querySelectorAll('.error').forEach(e => e.style.display = 'none');
    
    // Validate passwords match
    if (password !== passwordConfirm) {
        document.getElementById('registerPasswordConfirmError').textContent = 'Пароли не совпадают';
        document.getElementById('registerPasswordConfirmError').style.display = 'block';
        return;
    }
    
    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, name, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Redirect to login tab or handle successful registration
            switchTab('login');
        } else {
            // Show error message
            document.getElementById('registerEmailError').textContent = data.message;
            document.getElementById('registerEmailError').style.display = 'block';
        }
    } catch (error) {
        console.error('Error:', error);
    }
}