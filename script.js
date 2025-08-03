// DOM Elements
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginForm = document.getElementById('login-form');
const studentIdInput = document.getElementById('student-id');
const studentName = document.getElementById('student-name');
const logoutBtn = document.getElementById('logout-btn');

// ID Card Elements
const dormUploadArea = document.getElementById('dorm-upload-area');
const libraryUploadArea = document.getElementById('library-upload-area');
const gymUploadArea = document.getElementById('gym-upload-area');

const dormFileInput = document.getElementById('dorm-file');
const libraryFileInput = document.getElementById('library-file');
const gymFileInput = document.getElementById('gym-file');

const dormPreview = document.getElementById('dorm-preview');
const libraryPreview = document.getElementById('library-preview');
const gymPreview = document.getElementById('gym-preview');

// Gallery elements
const dormGallery = document.getElementById('dorm-gallery');
const libraryGallery = document.getElementById('library-gallery');
const gymGallery = document.getElementById('gym-gallery');

// Save Buttons
const saveButtons = document.querySelectorAll('.save-btn');

// Current user
let currentUser = null;

// Arrays to store multiple images for each ID type
let dormImages = [];
let libraryImages = [];
let gymImages = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    checkLoginStatus();
    
    // Setup event listeners
    setupEventListeners();
});

// Check if user is already logged in
function checkLoginStatus() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        showDashboard();
    }
}

// Setup all event listeners
function setupEventListeners() {
    // Login form submission
    loginForm.addEventListener('submit', handleLogin);
    
    // Logout button
    logoutBtn.addEventListener('click', handleLogout);
    
    // File input clicks
    dormUploadArea.addEventListener('click', () => dormFileInput.click());
    libraryUploadArea.addEventListener('click', () => libraryFileInput.click());
    gymUploadArea.addEventListener('click', () => gymFileInput.click());
    
    // File input changes
    dormFileInput.addEventListener('change', function(e) {
        handleFileSelect(e, dormPreview, dormGallery, 'dorm');
    });
    
    libraryFileInput.addEventListener('change', function(e) {
        handleFileSelect(e, libraryPreview, libraryGallery, 'library');
    });
    
    gymFileInput.addEventListener('change', function(e) {
        handleFileSelect(e, gymPreview, gymGallery, 'gym');
    });
    
    // Drag and drop events for dorm
    setupDragAndDrop(dormUploadArea, dormFileInput);
    
    // Drag and drop events for library
    setupDragAndDrop(libraryUploadArea, libraryFileInput);
    
    // Drag and drop events for gym
    setupDragAndDrop(gymUploadArea, gymFileInput);
    
    // Save buttons
    saveButtons.forEach(button => {
        button.addEventListener('click', handleSaveId);
    });
}

// Setup drag and drop functionality
function setupDragAndDrop(uploadArea, fileInput) {
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });
    
    uploadArea.addEventListener('dragleave', function() {
        uploadArea.classList.remove('drag-over');
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            const event = new Event('change');
            fileInput.dispatchEvent(event);
        }
    });
}

// Handle file selection for multiple images
function handleFileSelect(event, previewElement, galleryElement, idType) {
    const files = event.target.files;
    if (files.length > 0) {
        // Clear existing images for this ID type
        switch(idType) {
            case 'dorm':
                dormImages = [];
                break;
            case 'library':
                libraryImages = [];
                break;
            case 'gym':
                gymImages = [];
                break;
        }
        
        // Clear gallery
        galleryElement.innerHTML = '';
        
        // Process each file
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    // For the first image, show in main preview
                    if (i === 0) {
                        previewElement.src = e.target.result;
                        previewElement.style.display = 'block';
                    }
                    
                    // Add to images array
                    const imageData = e.target.result;
                    switch(idType) {
                        case 'dorm':
                            dormImages.push(imageData);
                            break;
                        case 'library':
                            libraryImages.push(imageData);
                            break;
                        case 'gym':
                            gymImages.push(imageData);
                            break;
                    }
                    
                    // Create thumbnail for gallery
                    const img = document.createElement('img');
                    img.src = imageData;
                    img.alt = `${idType} thumbnail ${i+1}`;
                    img.addEventListener('click', function() {
                        previewElement.src = imageData;
                        previewElement.style.display = 'block';
                    });
                    galleryElement.appendChild(img);
                    
                    // Add "add photo" button after first image
                    if (i === files.length - 1) {
                        const addBtn = document.createElement('div');
                        addBtn.className = 'add-photo-btn';
                        addBtn.innerHTML = '+';
                        addBtn.addEventListener('click', function() {
                            // Trigger file input click
                            switch(idType) {
                                case 'dorm':
                                    dormFileInput.click();
                                    break;
                                case 'library':
                                    libraryFileInput.click();
                                    break;
                                case 'gym':
                                    gymFileInput.click();
                                    break;
                            }
                        });
                        galleryElement.appendChild(addBtn);
                    }
                };
                reader.readAsDataURL(file);
            }
        }
    }
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    
    const studentId = studentIdInput.value.trim();
    
    if (studentId) {
        // In a real app, you would validate the student ID against a database
        // For this demo, we'll accept any non-empty ID
        currentUser = {
            id: studentId,
            name: `Student ${studentId}`
        };
        
        // Save current user to localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Load saved ID cards if they exist
        loadSavedIdCards();
        
        showDashboard();
    } else {
        alert('Please enter your student ID');
    }
}

// Handle logout
function handleLogout() {
    currentUser = null;
    dormImages = [];
    libraryImages = [];
    gymImages = [];
    localStorage.removeItem('currentUser');
    showLogin();
}

// Show dashboard
function showDashboard() {
    loginSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
    studentName.textContent = currentUser.name;
}

// Show login
function showLogin() {
    loginSection.classList.remove('hidden');
    dashboardSection.classList.add('hidden');
    studentIdInput.value = '';
    
    // Reset previews and galleries
    dormPreview.src = '';
    dormPreview.style.display = 'none';
    libraryPreview.src = '';
    libraryPreview.style.display = 'none';
    gymPreview.src = '';
    gymPreview.style.display = 'none';
    
    dormGallery.innerHTML = '';
    libraryGallery.innerHTML = '';
    gymGallery.innerHTML = '';
}

// Handle saving ID cards
function handleSaveId(e) {
    const idType = e.target.dataset.type;
    
    let imagesArray;
    let previewElement;
    
    switch(idType) {
        case 'dorm':
            imagesArray = dormImages;
            previewElement = dormPreview;
            break;
        case 'library':
            imagesArray = libraryImages;
            previewElement = libraryPreview;
            break;
        case 'gym':
            imagesArray = gymImages;
            previewElement = gymPreview;
            break;
    }
    
    if (imagesArray.length > 0) {
        // Save to localStorage
        saveIdCard(idType, imagesArray);
        alert(`${getIdTypeName(idType)} with ${imagesArray.length} image(s) saved successfully!`);
    } else if (previewElement.src && previewElement.src !== window.location.href) {
        // Save single image if no multiple images
        saveIdCard(idType, [previewElement.src]);
        alert(`${getIdTypeName(idType)} saved successfully!`);
    } else {
        alert(`Please select an image for your ${getIdTypeName(idType)} first`);
    }
}

// Get ID type name for display
function getIdTypeName(idType) {
    switch(idType) {
        case 'dorm': return 'Dorm ID';
        case 'library': return 'Library ID';
        case 'gym': return 'Gym ID';
        default: return 'ID';
    }
}

// Save ID card to localStorage
function saveIdCard(idType, imageDataArray) {
    if (!currentUser) return;
    
    const userId = currentUser.id;
    const storageKey = `idCards_${userId}`;
    
    // Get existing ID cards or initialize empty object
    let idCards = JSON.parse(localStorage.getItem(storageKey)) || {};
    
    // Save the new ID card images
    idCards[idType] = imageDataArray;
    
    // Save back to localStorage
    localStorage.setItem(storageKey, JSON.stringify(idCards));
}

// Load saved ID cards
function loadSavedIdCards() {
    if (!currentUser) return;
    
    const userId = currentUser.id;
    const storageKey = `idCards_${userId}`;
    
    const idCards = JSON.parse(localStorage.getItem(storageKey)) || {};
    
    // Load dorm ID if it exists
    if (idCards.dorm) {
        dormImages = idCards.dorm;
        if (dormImages.length > 0) {
            dormPreview.src = dormImages[0];
            dormPreview.style.display = 'block';
            updateGallery(dormGallery, dormImages, 'dorm');
        }
    }
    
    // Load library ID if it exists
    if (idCards.library) {
        libraryImages = idCards.library;
        if (libraryImages.length > 0) {
            libraryPreview.src = libraryImages[0];
            libraryPreview.style.display = 'block';
            updateGallery(libraryGallery, libraryImages, 'library');
        }
    }
    
    // Load gym ID if it exists
    if (idCards.gym) {
        gymImages = idCards.gym;
        if (gymImages.length > 0) {
            gymPreview.src = gymImages[0];
            gymPreview.style.display = 'block';
            updateGallery(gymGallery, gymImages, 'gym');
        }
    }
}

// Update gallery with saved images
function updateGallery(galleryElement, imagesArray, idType) {
    galleryElement.innerHTML = '';
    
    imagesArray.forEach((imageData, index) => {
        const img = document.createElement('img');
        img.src = imageData;
        img.alt = `${idType} thumbnail ${index+1}`;
        img.addEventListener('click', function() {
            // Set as main preview when clicked
            switch(idType) {
                case 'dorm':
                    dormPreview.src = imageData;
                    dormPreview.style.display = 'block';
                    break;
                case 'library':
                    libraryPreview.src = imageData;
                    libraryPreview.style.display = 'block';
                    break;
                case 'gym':
                    gymPreview.src = imageData;
                    gymPreview.style.display = 'block';
                    break;
            }
        });
        galleryElement.appendChild(img);
    });
    
    // Add "add photo" button
    const addBtn = document.createElement('div');
    addBtn.className = 'add-photo-btn';
    addBtn.innerHTML = '+';
    addBtn.addEventListener('click', function() {
        // Trigger file input click
        switch(idType) {
            case 'dorm':
                dormFileInput.click();
                break;
            case 'library':
                libraryFileInput.click();
                break;
            case 'gym':
                gymFileInput.click();
                break;
        }
    });
    galleryElement.appendChild(addBtn);
}
