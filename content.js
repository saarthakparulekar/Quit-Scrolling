// Variable to keep track of whether the popup is already displayed
let isPopupDisplayed = false;

// Function to create and show the popup
function showPopup() {
    if (isPopupDisplayed) return; // Prevent multiple popups
    isPopupDisplayed = true;

    // Create the overlay (fullscreen popup)
    const popupOverlay = document.createElement('div');
    popupOverlay.id = 'shorts-popup-overlay';
    popupOverlay.style = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8); /* Semi-transparent background */
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000; /* Ensure it appears above other content */
    `;

    // Create the popup content
    popupOverlay.innerHTML = `
        <div style="
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            text-align: center;
            max-width: 400px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        ">
            <p style="margin: 0; font-size: 18px; font-weight: bold; color: #333;">
                Stop scrolling. Your goals won't wait for you!
            </p>
            <button id="close-popup" style="
                margin-top: 20px;
                background-color: #f44336;
                color: white;
                border: none;
                padding: 10px 20px;
                font-size: 16px;
                border-radius: 5px;
                cursor: pointer;
            ">Close</button>
        </div>
    `;

    // Add the overlay to the page
    document.body.appendChild(popupOverlay);

    // Add functionality to the close button
    document.getElementById('close-popup').addEventListener('click', () => {
        popupOverlay.remove(); // Remove the popup overlay
        isPopupDisplayed = false; // Allow showing the popup again for new Shorts
    });
}

// Function to check if the current page is YouTube Shorts
function checkForYouTubeShorts() {
    if (window.location.href.includes('https://www.youtube.com/shorts/')) {
        showPopup(); // Show the popup if on Shorts
    } else {
        isPopupDisplayed = false; // Reset popup state if not on Shorts
    }
}

// Initialize listeners to detect URL changes and display the popup
function init() {
    // Initial check when the content script runs
    checkForYouTubeShorts();

    // Monitor URL changes using `pushState` and `popstate`
    const originalPushState = history.pushState;
    history.pushState = function (state, title, url) {
        originalPushState.apply(this, arguments);
        checkForYouTubeShorts(); // Check after URL change
    };

    window.addEventListener('popstate', () => {
        checkForYouTubeShorts(); // Check when navigating through browser history
    });

    // Backup check using MutationObserver for dynamic DOM changes
    const observer = new MutationObserver(() => {
        checkForYouTubeShorts();
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

// Run the initialization function
init();




