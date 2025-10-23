// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Tab functionality
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const targetTab = this.getAttribute('data-tab');
      
      // Remove active class from all tabs and contents
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(content => content.style.display = 'none');
      
      // Add active class to clicked tab and show corresponding content
      this.classList.add('active');
      document.getElementById(targetTab + '-tab').style.display = 'block';
      
      // Load users when users tab is clicked
      if (targetTab === 'users') {
        loadUsers();
      }
    });
  });

  // Initialize modal functionality after DOM is loaded
  initializeModal();
});

  // Load users function
  function loadUsers() {
    const loading = document.getElementById('users-loading');
    const tableContainer = document.getElementById('users-table-container');
    const errorDiv = document.getElementById('users-error');
    const tableBody = document.getElementById('users-table-body');
    
    loading.style.display = 'block';
    tableContainer.style.display = 'none';
    errorDiv.style.display = 'none';
    
    fetch('/admin/users')
      .then(response => {
        if (response.status === 401) {
          alert('Session expired. Please log in again.');
          window.location.href = '/login';
          return;
        }
        if (response.status === 403) {
          alert('Access denied. Admin privileges required.');
          return;
        }
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(users => {
        loading.style.display = 'none';
        tableBody.innerHTML = '';
        
        users.forEach(user => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.phone || 'N/A'}</td>
            <td><span class="role-badge role-${user.role}">${user.role}</span></td>
            <td>
              <button class="change-role-btn" onclick="openRoleModal(${user.id}, '${user.name}', '${user.role}')">
                Change Role
              </button>
            </td>
          `;
          tableBody.appendChild(row);
        });
        
        tableContainer.style.display = 'block';
      })
        .catch(error => {
          loading.style.display = 'none';
          errorDiv.style.display = 'block';
        });
  }

// Initialize modal functionality
function initializeModal() {
  const modal = document.getElementById('roleModal');
  const closeBtn = document.querySelector('.close');
  
  if (!modal) {
    return;
  }

  if (closeBtn) {
    closeBtn.onclick = function() {
      modal.style.display = 'none';
    }
  }

  // Close modal when clicking outside
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  }

  // Role change form submission
  const roleChangeForm = document.getElementById('roleChangeForm');
  if (roleChangeForm) {
    roleChangeForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const userId = document.getElementById('modal-user-id').value;
      const newRole = document.getElementById('newRole').value;
      
      if (!userId || !newRole) {
        alert('Please select a role');
        return;
      }
      
      fetch('/admin/users/update-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          newRole: newRole
        })
      })
      .then(response => {
        if (response.status === 401) {
          alert('Session expired. Please log in again.');
          window.location.href = '/login';
          return;
        }
        if (response.status === 403) {
          alert('Access denied. Admin privileges required.');
          return;
        }
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.success) {
          alert('User role updated successfully!');
          modal.style.display = 'none';
          loadUsers(); // Refresh the users table
        } else {
          alert('Error: ' + data.error);
        }
      })
      .catch(error => {
        alert('Error updating user role: ' + error.message);
      });
    });
  }
}

// Function to open role modal
function openRoleModal(userId, userName, currentRole) {
  const modal = document.getElementById('roleModal');
  const modalUserId = document.getElementById('modal-user-id');
  const modalUserName = document.getElementById('modal-user-name');
  const newRoleSelect = document.getElementById('newRole');
  
  if (modal && modalUserId && modalUserName && newRoleSelect) {
    modalUserId.value = userId;
    modalUserName.textContent = userName;
    newRoleSelect.value = currentRole;
    modal.style.display = 'block';
  } else {
    alert('Error: Modal elements not found');
  }
}