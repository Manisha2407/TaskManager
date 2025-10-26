// Form validation and interaction handling
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const successMessage = document.getElementById('successMessage');
    
    // Form fields
    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');
    const subjectField = document.getElementById('subject');
    const messageField = document.getElementById('message');
    
    // Error elements
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const subjectError = document.getElementById('subjectError');
    const messageError = document.getElementById('messageError');

    // Add animation classes on load
    setTimeout(() => {
        document.querySelector('.hero').classList.add('fade-in');
        document.querySelector('.contact-section').classList.add('slide-up');
    }, 100);

    // Validation functions
    function validateName(name) {
        if (!name.trim()) {
            return 'Name is required';
        }
        if (name.trim().length < 2) {
            return 'Name must be at least 2 characters';
        }
        return '';
    }

    function validateEmail(email) {
        if (!email.trim()) {
            return 'Email is required';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return 'Please enter a valid email address';
        }
        return '';
    }

    function validateSubject(subject) {
        if (!subject) {
            return 'Please select a subject';
        }
        return '';
    }

    function validateMessage(message) {
        if (!message.trim()) {
            return 'Message is required';
        }
        if (message.trim().length < 10) {
            return 'Message must be at least 10 characters';
        }
        return '';
    }

    // Show error function
    function showError(field, errorElement, message) {
        field.classList.add('error');
        field.classList.remove('success');
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }

    // Show success function
    function showSuccess(field, errorElement) {
        field.classList.add('success');
        field.classList.remove('error');
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }

    // Real-time validation
    nameField.addEventListener('blur', function() {
        const error = validateName(this.value);
        if (error) {
            showError(this, nameError, error);
        } else {
            showSuccess(this, nameError);
        }
    });

    emailField.addEventListener('blur', function() {
        const error = validateEmail(this.value);
        if (error) {
            showError(this, emailError, error);
        } else {
            showSuccess(this, emailError);
        }
    });

    subjectField.addEventListener('change', function() {
        const error = validateSubject(this.value);
        if (error) {
            showError(this, subjectError, error);
        } else {
            showSuccess(this, subjectError);
        }
    });

    messageField.addEventListener('blur', function() {
        const error = validateMessage(this.value);
        if (error) {
            showError(this, messageError, error);
        } else {
            showSuccess(this, messageError);
        }
    });

    // Clear errors on input
    [nameField, emailField, messageField].forEach(field => {
        field.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                this.classList.remove('error');
                const errorElement = document.getElementById(this.id + 'Error');
                errorElement.classList.remove('show');
            }
        });
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validate all fields
        const nameErr = validateName(nameField.value);
        const emailErr = validateEmail(emailField.value);
        const subjectErr = validateSubject(subjectField.value);
        const messageErr = validateMessage(messageField.value);

        // Show errors if any
        if (nameErr) showError(nameField, nameError, nameErr);
        else showSuccess(nameField, nameError);

        if (emailErr) showError(emailField, emailError, emailErr);
        else showSuccess(emailField, emailError);

        if (subjectErr) showError(subjectField, subjectError, subjectErr);
        else showSuccess(subjectField, subjectError);

        if (messageErr) showError(messageField, messageError, messageErr);
        else showSuccess(messageField, messageError);

        // If no errors, submit form
        if (!nameErr && !emailErr && !subjectErr && !messageErr) {
            submitForm();
        }
    });

    // Submit form function
    function submitForm() {
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.querySelector('.btn-text').style.display = 'none';
        submitBtn.querySelector('.btn-loading').style.display = 'flex';

        // Simulate API call
        setTimeout(() => {
            // Hide form and show success message
            form.style.display = 'none';
            successMessage.style.display = 'block';
            successMessage.classList.add('fade-in');

            // Reset form after showing success
            setTimeout(() => {
                form.reset();
                form.style.display = 'block';
                successMessage.style.display = 'none';
                submitBtn.disabled = false;
                submitBtn.querySelector('.btn-text').style.display = 'inline';
                submitBtn.querySelector('.btn-loading').style.display = 'none';

                // Clear all validation states
                [nameField, emailField, subjectField, messageField].forEach(field => {
                    field.classList.remove('error', 'success');
                });
            }, 3000);
        }, 2000);
    }

    // Smooth scrolling for navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            // Add smooth scroll behavior here if needed
        });
    });

    // Add subtle parallax effect on scroll
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.hero');
        const speed = 0.5;
        
        if (parallax) {
            parallax.style.transform = `translateY(${scrolled * speed}px)`;
        }
    });

    // Enhanced form interactions
    document.querySelectorAll('.form-input').forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });

    // Add floating label effect
    document.querySelectorAll('.form-input').forEach(input => {
        input.addEventListener('input', function() {
            if (this.value) {
                this.classList.add('has-value');
            } else {
                this.classList.remove('has-value');
            }
        });
    });

    // Character counter for message field
    const messageCounter = document.createElement('div');
    messageCounter.className = 'character-counter';
    messageCounter.style.cssText = `
        text-align: right;
        font-size: 0.8rem;
        color: #64748b;
        margin-top: 0.25rem;
    `;
    messageField.parentElement.appendChild(messageCounter);

    messageField.addEventListener('input', function() {
        const length = this.value.length;
        messageCounter.textContent = `${length}/500 characters`;
        
        if (length > 500) {
            messageCounter.style.color = '#ef4444';
        } else {
            messageCounter.style.color = '#64748b';
        }
    });

    // Initialize character counter
    messageCounter.textContent = '0/500 characters';
});

// Add some subtle animations on page load
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    },100);
});
