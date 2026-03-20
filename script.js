// Feedback storage and management
class FeedbackManager {
    constructor() {
        this.feedbacks = JSON.parse(localStorage.getItem('tourismFeedbacks')) || [];
    }

    saveFeedback(feedback) {
        feedback.id = Date.now();
        feedback.timestamp = new Date().toLocaleString();
        this.feedbacks.unshift(feedback); // Add to beginning for recent first
        this.saveToStorage();
        this.displayFeedbacks();
    }

    saveToStorage() {
        localStorage.setItem('tourismFeedbacks', JSON.stringify(this.feedbacks));
    }

    displayFeedbacks() {
        const feedbackItems = document.getElementById('feedbackItems');
        feedbackItems.innerHTML = '';

        if (this.feedbacks.length === 0) {
            feedbackItems.innerHTML = '<p>No feedback submitted yet.</p>';
            return;
        }

        this.feedbacks.slice(0, 5).forEach(feedback => { // Show only last 5
            const item = document.createElement('div');
            item.className = 'feedback-item';
            item.innerHTML = `
                <h3>${this.getCampaignName(feedback.campaign)}</h3>
                <p><strong>Name:</strong> ${feedback.name}</p>
                <p><strong>Email:</strong> ${feedback.email}</p>
                <p><strong>Rating:</strong> <span class="rating-display">${'★'.repeat(feedback.rating)}${'☆'.repeat(5 - feedback.rating)}</span></p>
                <p><strong>Comments:</strong> ${feedback.comments || 'No comments'}</p>
                <p><small>Submitted on: ${feedback.timestamp}</small></p>
            `;
            feedbackItems.appendChild(item);
        });
    }

    getCampaignName(value) {
        const campaigns = {
            'beach-paradise': 'Beach Paradise 2024',
            'mountain-adventure': 'Mountain Adventure',
            'city-exploration': 'City Exploration',
            'cultural-heritage': 'Cultural Heritage',
            'eco-tourism': 'Eco-Tourism Initiative'
        };
        return campaigns[value] || value;
    }
}

// Form validation and submission
class FeedbackForm {
    constructor(manager) {
        this.manager = manager;
        this.form = document.getElementById('feedbackForm');
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData(this.form);
        const feedback = {
            campaign: formData.get('campaign'),
            name: formData.get('name'),
            email: formData.get('email'),
            rating: parseInt(formData.get('rating')),
            comments: formData.get('comments')
        };

        if (this.validateFeedback(feedback)) {
            this.manager.saveFeedback(feedback);
            this.form.reset();
            this.showSuccessMessage();
        }
    }

    validateFeedback(feedback) {
        if (!feedback.campaign || !feedback.name || !feedback.email || !feedback.rating) {
            alert('Please fill in all required fields.');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(feedback.email)) {
            alert('Please enter a valid email address.');
            return false;
        }

        return true;
    }

    showSuccessMessage() {
        const successMsg = document.createElement('div');
        successMsg.textContent = 'Thank you for your feedback!';
        successMsg.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;

        document.body.appendChild(successMsg);

        setTimeout(() => {
            successMsg.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => document.body.removeChild(successMsg), 300);
        }, 3000);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const feedbackManager = new FeedbackManager();
    const feedbackForm = new FeedbackForm(feedbackManager);

    // Display existing feedbacks on load
    feedbackManager.displayFeedbacks();
});

// Add CSS animations for success message
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
