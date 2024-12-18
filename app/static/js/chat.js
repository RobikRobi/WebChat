let currentChat = null;
let users = [];
let messages = {};

async function logout() {
    try {
        const response = await fetch('/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            window.location.href = '/auth';
        } else {
            console.error('Logout failed');
        }
    } catch (error) {
        console.error('Error during logout:', error);
    }
}

async function loadUsers() {
    try {
        const response = await fetch('/api/users');
        users = await response.json();
        displayUsers();
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

function displayUsers() {
    const usersList = document.getElementById('usersList');
    usersList.innerHTML = users.map(user => `
        <div class="user-item" onclick="selectChat('${user.id}', '${user.name}')">
            ${user.name}
        </div>
    `).join('');
}

function selectChat(userId, userName) {
    currentChat = userId;
    
    // Update UI
    document.querySelectorAll('.user-item').forEach(item => {
        item.classList.remove('active');
        if(item.textContent.trim() === userName) {
            item.classList.add('active');
        }
    });
    
    // Set up chat area
    const chatArea = document.getElementById('chatArea');
    chatArea.innerHTML = document.getElementById('chatTemplate').innerHTML;
    
    // Set chat header
    document.getElementById('chatUserName').textContent = userName;
    
    // Load messages
    loadMessages(userId);
}

async function loadMessages(userId) {
    try {
        const response = await fetch(`/api/messages/${userId}`);
        messages[userId] = await response.json();
        displayMessages();
    } catch (error) {
        console.error('Error loading messages:', error);
    }
}

function displayMessages() {
    if (!currentChat) return;
    
    const container = document.getElementById('messagesContainer');
    container.innerHTML = messages[currentChat].map(msg => `
        <div class="message ${msg.sent ? 'sent' : 'received'}">
            ${msg.text}
        </div>
    `).join('');
    
    container.scrollTop = container.scrollHeight;
}

async function sendMessage() {
    if (!currentChat) return;
    
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    try {
        const response = await fetch('/api/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                receiverId: currentChat,
                text: message
            })
        });
        
        if (response.ok) {
            input.value = '';
            await loadMessages(currentChat);
        }
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadUsers();
    
    // Add enter key handler for message input
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey && document.activeElement.id === 'messageInput') {
            e.preventDefault();
            sendMessage();
        }
    });
});