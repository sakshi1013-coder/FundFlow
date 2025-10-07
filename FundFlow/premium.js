// Premium Verification System
class PremiumVerificationManager {
    constructor() {
        this.verificationTiers = {
            basic: {
                name: 'Basic Verification',
                price: 499,
                features: [
                    '✓ Verified badge on campaign',
                    '✓ Priority in search results',
                    '✓ Trust indicator for donors',
                    '✓ Basic campaign analytics',
                    '✓ Email verification'
                ],
                badge: 'verified-basic'
            },
            premium: {
                name: 'Premium Verification',
                price: 999,
                features: [
                    '✓ Premium verified badge',
                    '✓ Top placement in featured campaigns',
                    '✓ Advanced analytics dashboard',
                    '✓ Priority customer support',
                    '✓ Social media verification',
                    '✓ Phone number verification',
                    '✓ Document verification',
                    '✓ Custom campaign URL',
                    '✓ Enhanced sharing tools'
                ],
                badge: 'verified-premium'
            },
            organization: {
                name: 'Organization Verification',
                price: 1999,
                features: [
                    '✓ Organization verified badge',
                    '✓ Top priority in all listings',
                    '✓ Professional analytics suite',
                    '✓ Dedicated account manager',
                    '✓ Legal document verification',
                    '✓ Tax exemption certificate',
                    '✓ Bulk campaign management',
                    '✓ White-label options',
                    '✓ API access for integrations',
                    '✓ Custom branding options'
                ],
                badge: 'verified-organization'
            }
        };
        this.init();
    }

    init() {
        this.createVerificationModal();
        this.attachEventListeners();
    }

    createVerificationModal() {
        const modalHTML = `
            <div id="verification-modal" class="verification-modal">
                <div class="verification-modal-content">
                    <button id="close-verification-modal" class="verification-close-btn">&times;</button>
                    
                    <div class="verification-header">
                        <h2>🏆 Get Verified - Boost Your Campaign's Credibility</h2>
                        <p>Verified campaigns receive 3x more donations on average. Choose the plan that fits your needs:</p>
                    </div>

                    <div class="verification-tiers">
                        ${this.createTierHTML('basic')}
                        ${this.createTierHTML('premium')}
                        ${this.createTierHTML('organization')}
                    </div>

                    <div class="verification-process">
                        <h3>📋 Verification Process</h3>
                        <div class="process-steps">
                            <div class="process-step">
                                <div class="step-number">1</div>
                                <div class="step-content">
                                    <h4>Choose Your Plan</h4>
                                    <p>Select the verification tier that matches your needs</p>
                                </div>
                            </div>
                            <div class="process-step">
                                <div class="step-number">2</div>
                                <div class="step-content">
                                    <h4>Submit Documents</h4>
                                    <p>Upload required documents for verification</p>
                                </div>
                            </div>
                            <div class="process-step">
                                <div class="step-number">3</div>
                                <div class="step-content">
                                    <h4>Review & Approval</h4>
                                    <p>Our team reviews your application (24-48 hours)</p>
                                </div>
                            </div>
                            <div class="process-step">
                                <div class="step-number">4</div>
                                <div class="step-content">
                                    <h4>Get Verified!</h4>
                                    <p>Your campaign gets the verified badge and benefits</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    createTierHTML(tierKey) {
        const tier = this.verificationTiers[tierKey];
        const isPopular = tierKey === 'premium';
        
        return `
            <div class="verification-tier ${isPopular ? 'popular' : ''}" data-tier="${tierKey}">
                ${isPopular ? '<div class="popular-badge">Most Popular</div>' : ''}
                <div class="tier-header">
                    <h3>${tier.name}</h3>
                    <div class="tier-price">
                        <span class="currency">₹</span>
                        <span class="amount">${tier.price.toLocaleString()}</span>
                        <span class="period">one-time</span>
                    </div>
                </div>
                <div class="tier-features">
                    ${tier.features.map(feature => `<div class="feature">${feature}</div>`).join('')}
                </div>
                <button class="tier-select-btn" onclick="premiumManager.selectTier('${tierKey}')">
                    Choose ${tier.name}
                </button>
            </div>
        `;
    }

    attachEventListeners() {
        // Close modal
        document.getElementById('close-verification-modal').onclick = () => this.closeVerificationModal();
        
        // Close modal when clicking outside
        document.getElementById('verification-modal').onclick = (e) => {
            if (e.target.id === 'verification-modal') {
                this.closeVerificationModal();
            }
        };
    }

    openVerificationModal() {
        document.getElementById('verification-modal').classList.add('active');
    }

    closeVerificationModal() {
        document.getElementById('verification-modal').classList.remove('active');
    }

    selectTier(tierKey) {
        const tier = this.verificationTiers[tierKey];
        
        // Close verification modal
        this.closeVerificationModal();
        
        // Open application modal
        this.openApplicationModal(tierKey, tier);
    }

    openApplicationModal(tierKey, tier) {
        const applicationHTML = `
            <div id="application-modal" class="application-modal">
                <div class="application-modal-content">
                    <button id="close-application-modal" class="application-close-btn">&times;</button>
                    
                    <div class="application-header">
                        <h2>Apply for ${tier.name}</h2>
                        <div class="selected-tier-info">
                            <div class="tier-badge ${tier.badge}"></div>
                            <div class="tier-details">
                                <span class="tier-name">${tier.name}</span>
                                <span class="tier-price">₹${tier.price.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <form id="verification-application-form" class="application-form">
                        <input type="hidden" id="selected-tier" value="${tierKey}">
                        
                        <div class="form-section">
                            <h3>Basic Information</h3>
                            <div class="form-group">
                                <label>Full Name / Organization Name</label>
                                <input type="text" name="applicantName" required>
                            </div>
                            <div class="form-group">
                                <label>Email Address</label>
                                <input type="email" name="email" required>
                            </div>
                            <div class="form-group">
                                <label>Phone Number</label>
                                <input type="tel" name="phone" required>
                            </div>
                            <div class="form-group">
                                <label>Campaign Title</label>
                                <input type="text" name="campaignTitle" required>
                            </div>
                        </div>

                        ${this.getAdditionalFields(tierKey)}

                        <div class="form-section">
                            <h3>Document Upload</h3>
                            <div class="upload-requirements">
                                ${this.getUploadRequirements(tierKey)}
                            </div>
                            <div class="form-group">
                                <label>Upload Documents</label>
                                <input type="file" name="documents" multiple accept=".pdf,.jpg,.jpeg,.png" required>
                                <small>Supported formats: PDF, JPG, PNG (Max 10MB per file)</small>
                            </div>
                        </div>

                        <div class="payment-section">
                            <h3>Payment</h3>
                            <div class="payment-summary">
                                <div class="payment-line">
                                    <span>${tier.name}</span>
                                    <span>₹${tier.price.toLocaleString()}</span>
                                </div>
                                <div class="payment-line total">
                                    <span><strong>Total</strong></span>
                                    <span><strong>₹${tier.price.toLocaleString()}</strong></span>
                                </div>
                            </div>
                            <div class="payment-methods">
                                <label class="payment-method">
                                    <input type="radio" name="paymentMethod" value="upi" checked>
                                    <span>UPI Payment</span>
                                </label>
                                <label class="payment-method">
                                    <input type="radio" name="paymentMethod" value="card">
                                    <span>Credit/Debit Card</span>
                                </label>
                                <label class="payment-method">
                                    <input type="radio" name="paymentMethod" value="netbanking">
                                    <span>Net Banking</span>
                                </label>
                            </div>
                        </div>

                        <div class="application-actions">
                            <button type="button" onclick="premiumManager.goBack()" class="btn-secondary">
                                Back to Plans
                            </button>
                            <button type="submit" class="btn-primary">
                                Pay ₹${tier.price.toLocaleString()} & Apply
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        // Remove existing application modal if any
        const existingModal = document.getElementById('application-modal');
        if (existingModal) existingModal.remove();

        document.body.insertAdjacentHTML('beforeend', applicationHTML);

        // Add event listeners for the new modal
        document.getElementById('close-application-modal').onclick = () => {
            document.getElementById('application-modal').remove();
        };

        document.getElementById('verification-application-form').onsubmit = (e) => {
            e.preventDefault();
            this.submitApplication(tierKey, tier);
        };

        // Show the modal
        setTimeout(() => {
            document.getElementById('application-modal').classList.add('active');
        }, 100);
    }

    getAdditionalFields(tierKey) {
        if (tierKey === 'organization') {
            return `
                <div class="form-section">
                    <h3>Organization Details</h3>
                    <div class="form-group">
                        <label>Organization Type</label>
                        <select name="organizationType" required>
                            <option value="">Select Type</option>
                            <option value="ngo">NGO</option>
                            <option value="charity">Charity</option>
                            <option value="foundation">Foundation</option>
                            <option value="trust">Trust</option>
                            <option value="company">Company</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Registration Number</label>
                        <input type="text" name="registrationNumber" required>
                    </div>
                    <div class="form-group">
                        <label>Tax Exemption Number (if applicable)</label>
                        <input type="text" name="taxExemptionNumber">
                    </div>
                </div>
            `;
        }
        return '';
    }

    getUploadRequirements(tierKey) {
        const requirements = {
            basic: [
                '• Government-issued ID (Aadhaar, PAN, Passport)',
                '• Address proof',
                '• Photo of campaign organizer'
            ],
            premium: [
                '• Government-issued ID (Aadhaar, PAN, Passport)',
                '• Address proof',
                '• Photo of campaign organizer',
                '• Social media profile verification',
                '• Additional identity verification documents'
            ],
            organization: [
                '• Organization registration certificate',
                '• Tax exemption certificate (80G/12A)',
                '• PAN card of organization',
                '• Address proof of organization',
                '• Board resolution/authorization letter',
                '• Photos of organization premises',
                '• Key personnel identification'
            ]
        };

        return `
            <p>Please upload the following documents:</p>
            <ul>
                ${requirements[tierKey].map(req => `<li>${req}</li>`).join('')}
            </ul>
        `;
    }

    async submitApplication(tierKey, tier) {
        const form = document.getElementById('verification-application-form');
        const formData = new FormData(form);
        
        // Show loading
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Processing Payment...';
        submitBtn.disabled = true;

        try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 3000));

            // Create application data
            const applicationData = {
                tier: tierKey,
                applicantName: formData.get('applicantName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                campaignTitle: formData.get('campaignTitle'),
                organizationType: formData.get('organizationType'),
                registrationNumber: formData.get('registrationNumber'),
                taxExemptionNumber: formData.get('taxExemptionNumber'),
                paymentMethod: formData.get('paymentMethod'),
                amount: tier.price,
                status: 'pending',
                submittedAt: new Date(),
                documents: formData.getAll('documents')
            };

            console.log('Verification application submitted:', applicationData);

            // Here you would save to your database
            // await this.saveApplication(applicationData);

            // Close modal and show success
            document.getElementById('application-modal').remove();
            
            this.showSuccessMessage(tier);

        } catch (error) {
            console.error('Application submission failed:', error);
            alert('Sorry, there was an error processing your application. Please try again.');
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    showSuccessMessage(tier) {
        const successHTML = `
            <div id="success-modal" class="success-modal">
                <div class="success-modal-content">
                    <div class="success-icon">✅</div>
                    <h2>Application Submitted Successfully!</h2>
                    <p>Thank you for applying for <strong>${tier.name}</strong>!</p>
                    
                    <div class="success-details">
                        <h3>What's Next?</h3>
                        <ul>
                            <li>Our team will review your application within 24-48 hours</li>
                            <li>You'll receive an email with the verification status</li>
                            <li>Once approved, your name will display the <img src="photos/verifyicon.png" style="width: 16px; height: 16px; vertical-align: middle; margin: 0 4px;"> verification icon</li>
                            <li>Your campaign will show verified status to build trust</li>
                            <li>You'll gain access to all premium features immediately</li>
                        </ul>
                    </div>
                    
                    <div class="success-actions">
                        <button onclick="document.getElementById('success-modal').remove()" class="btn-primary">
                            Got It!
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', successHTML);
        
        setTimeout(() => {
            document.getElementById('success-modal').classList.add('active');
        }, 100);

        // Auto-close after 10 seconds
        setTimeout(() => {
            const modal = document.getElementById('success-modal');
            if (modal) modal.remove();
        }, 10000);
    }

    goBack() {
        document.getElementById('application-modal').remove();
        this.openVerificationModal();
    }

    // Method to save application (integrate with your backend)
    async saveApplication(applicationData) {
        // Implement your database saving logic here
        // This could integrate with Firebase Firestore or your preferred database
    }

    // Method to add verification badges to campaigns
    addVerificationBadge(campaignElement, tierKey) {
        const tier = this.verificationTiers[tierKey];
        if (!tier) return;

        const badgeHTML = `
            <img src="photos/verifyicon.png" class="verification-icon ${tier.badge}" title="${tier.name} - Verified Campaign" alt="Verified">
        `;

        // Find the campaign title or appropriate location to add badge
        const titleElement = campaignElement.querySelector('h3') || campaignElement.querySelector('.campaign-title');
        if (titleElement) {
            titleElement.insertAdjacentHTML('afterbegin', badgeHTML);
        }
    }

    // Method to check if campaign is verified
    isVerified(campaignId) {
        // This would check your database for verification status
        // For demo purposes, returning random verification
        return Math.random() > 0.7; // 30% chance of being verified
    }

    // Method to get verification tier
    getVerificationTier(campaignId) {
        // This would fetch from your database
        // For demo purposes, returning random tier
        const tiers = ['basic', 'premium', 'organization'];
        return tiers[Math.floor(Math.random() * tiers.length)];
    }

    // Method to add verification icon to user/organizer names
    addVerificationIconToName(nameElement, tierKey) {
        const tier = this.verificationTiers[tierKey];
        if (!tier) return;

        // Check if verification icon already exists
        if (nameElement.querySelector('.verification-icon')) return;

        const iconHTML = `
            <img src="photos/verifyicon.png" class="verification-icon verification-icon-${tierKey}" title="${tier.name} - Verified User" alt="Verified">
        `;

        nameElement.insertAdjacentHTML('beforeend', iconHTML);
    }

    // Method to add verification status to all campaign organizers on page
    addVerificationToAllCampaigns() {
        // Find all campaign cards and add verification icons randomly for demo
        document.querySelectorAll('.campaign-card').forEach((card, index) => {
            const titleElement = card.querySelector('h3');
            if (titleElement && Math.random() > 0.6) { // 40% chance of being verified for demo
                const tierKey = this.getVerificationTier(`campaign-${index}`);
                this.addVerificationBadge(card, tierKey);
            }
        });
    }

    // Method to simulate adding verification to a specific user after approval
    markUserAsVerified(userId, tierKey) {
        // Find all elements with this user's name and add verification icon
        const userNameElements = document.querySelectorAll(`[data-user-id="${userId}"], .organizer-name, .donor-name`);
        userNameElements.forEach(element => {
            this.addVerificationIconToName(element, tierKey);
        });

        // Also add to campaign cards if this user is the organizer
        const userCampaigns = document.querySelectorAll(`[data-organizer-id="${userId}"]`);
        userCampaigns.forEach(campaign => {
            this.addVerificationBadge(campaign, tierKey);
        });
    }
}

// Global function to open verification modal
function openVerificationModal() {
    if (!window.premiumManager) {
        window.premiumManager = new PremiumVerificationManager();
    }
    window.premiumManager.openVerificationModal();
}

// Demo function to simulate user getting verified (for testing purposes)
function simulateVerification(email, tier = 'premium') {
    // Simulate storing verification in localStorage
    const verifiedUsers = JSON.parse(localStorage.getItem('verifiedUsers') || '{}');
    verifiedUsers[email] = {
        tier: tier,
        applicantName: 'Demo User',
        verifiedAt: new Date().toISOString()
    };
    localStorage.setItem('verifiedUsers', JSON.stringify(verifiedUsers));
    
    // Apply verification immediately
    if (window.premiumManager) {
        const userId = btoa(email).substr(0, 8);
        window.premiumManager.markUserAsVerified(userId, tier);
        
        // Also apply to campaigns with this email
        const campaigns = document.querySelectorAll(`[data-user-email="${email}"]`);
        campaigns.forEach(campaign => {
            window.premiumManager.addVerificationBadge(campaign, tier);
        });
    }
    
    console.log(`✅ Applied ${tier} verification to ${email}`);
    alert(`✅ Demo: User with email "${email}" is now ${tier} verified! Look for the verification icon next to their name/campaign.`);
}

// Function to check navigation for verified user
function checkNavVerification() {
    const navUsername = document.getElementById('nav-username');
    if (navUsername && navUsername.textContent !== 'Signup / Login') {
        // User is logged in, check if they're verified
        const verifiedUsers = JSON.parse(localStorage.getItem('verifiedUsers') || '{}');
        
        // For demo purposes, we'll randomly verify some users
        if (Math.random() > 0.7) { // 30% chance of being verified
            const tiers = ['basic', 'premium', 'organization'];
            const tier = tiers[Math.floor(Math.random() * tiers.length)];
            
            if (window.premiumManager && !navUsername.querySelector('.verification-icon')) {
                window.premiumManager.addVerificationIconToName(navUsername, tier);
            }
        }
    }
}

// Function to check and apply verification from localStorage
function checkAndApplyVerification() {
    const verifiedUsers = JSON.parse(localStorage.getItem('verifiedUsers') || '{}');
    
    // Apply verification to campaigns randomly for demo
    document.querySelectorAll('.campaign-card').forEach((card, index) => {
        const titleElement = card.querySelector('h3');
        if (titleElement && Math.random() > 0.6) { // 40% chance of being verified for demo
            const tiers = ['basic', 'premium', 'organization'];
            const tierKey = tiers[Math.floor(Math.random() * tiers.length)];
            
            if (window.premiumManager) {
                window.premiumManager.addVerificationBadge(card, tierKey);
            }
        }
    });
    
    // Apply verification to any user names that match verified users
    Object.keys(verifiedUsers).forEach(email => {
        const verification = verifiedUsers[email];
        const nameElements = document.querySelectorAll(`[data-user-email="${email}"], .organizer-name, .donor-name`);
        nameElements.forEach(element => {
            if (window.premiumManager) {
                window.premiumManager.addVerificationIconToName(element, verification.tier);
            }
        });
    });
}

// Initialize premium manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (!window.premiumManager) {
        window.premiumManager = new PremiumVerificationManager();
    }
    
    // Check and apply verification after a short delay to ensure all elements are loaded
    setTimeout(checkAndApplyVerification, 500);
    
    // Also check for logged-in user verification in navigation
    setTimeout(checkNavVerification, 1000);
});
