// Donation functionality with optional platform tips
class DonationManager {
    constructor() {
        this.currentCampaign = null;
        this.selectedAmount = 0;
        this.selectedTip = 0;
        this.customTip = 0;
        this.tipPercentages = [10, 15, 20]; // Default tip percentages
        this.init();
    }

    init() {
        this.createDonationModal();
        this.attachEventListeners();
    }

    createDonationModal() {
        const modalHTML = `
            <div id="donation-modal" class="donation-modal">
                <div class="donation-modal-content">
                    <button id="close-donation-modal" class="donation-close-btn">&times;</button>
                    
                    <div class="donation-header">
                        <h2>Support This Campaign</h2>
                        <div id="campaign-info" class="campaign-info">
                            <h3 id="donation-campaign-title">Campaign Title</h3>
                            <p id="donation-campaign-desc">Campaign description...</p>
                        </div>
                    </div>

                    <div class="donation-form">
                        <div class="donation-amount-section">
                            <h3>How much would you like to donate?</h3>
                            <div class="amount-buttons">
                                <button class="amount-btn" data-amount="500">₹500</button>
                                <button class="amount-btn" data-amount="1000">₹1,000</button>
                                <button class="amount-btn" data-amount="2000">₹2,000</button>
                                <button class="amount-btn" data-amount="5000">₹5,000</button>
                            </div>
                            <div class="custom-amount">
                                <input type="number" id="custom-amount" placeholder="Enter custom amount" min="50">
                                <span>₹</span>
                            </div>
                        </div>

                        <div class="platform-tip-section">
                            <div class="tip-header">
                                <h3>💡 Support FundFlow (Optional)</h3>
                                <p class="tip-explanation">
                                    FundFlow has 0% platform fees for you, but it's not free for us to operate. 
                                    Consider adding a small tip to help us keep the platform running and free for everyone.
                                </p>
                            </div>
                            
                            <div class="tip-options">
                                <div class="tip-buttons">
                                    <button class="tip-btn" data-tip="0">No Tip</button>
                                    <button class="tip-btn" data-tip-percent="10">10%</button>
                                    <button class="tip-btn" data-tip-percent="15">15% (Most Popular)</button>
                                    <button class="tip-btn" data-tip-percent="20">20%</button>
                                </div>
                                <div class="custom-tip">
                                    <input type="number" id="custom-tip-amount" placeholder="Custom tip amount" min="0">
                                    <span>₹</span>
                                </div>
                            </div>
                            
                            <div class="tip-breakdown">
                                <div class="breakdown-line">
                                    <span>Your donation:</span>
                                    <span id="donation-amount-display">₹0</span>
                                </div>
                                <div class="breakdown-line tip-line">
                                    <span>FundFlow tip:</span>
                                    <span id="tip-amount-display">₹0</span>
                                </div>
                                <div class="breakdown-line total-line">
                                    <span><strong>Total:</strong></span>
                                    <span id="total-amount-display"><strong>₹0</strong></span>
                                </div>
                            </div>
                        </div>

                        <div class="donation-actions">
                            <div class="donor-info">
                                <input type="text" id="donor-name" placeholder="Your Name (Optional)" maxlength="50">
                                <label class="anonymous-checkbox">
                                    <input type="checkbox" id="anonymous-donation">
                                    <span>Make this donation anonymous</span>
                                </label>
                            </div>
                            <button id="proceed-donation" class="donation-btn" disabled>
                                Donate Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    attachEventListeners() {
        // Close modal
        document.getElementById('close-donation-modal').onclick = () => this.closeDonationModal();
        
        // Amount selection
        document.querySelectorAll('.amount-btn').forEach(btn => {
            btn.onclick = (e) => this.selectAmount(parseInt(e.target.dataset.amount));
        });
        
        // Custom amount
        document.getElementById('custom-amount').oninput = (e) => {
            this.selectAmount(parseInt(e.target.value) || 0);
            // Remove active class from preset buttons
            document.querySelectorAll('.amount-btn').forEach(btn => btn.classList.remove('active'));
        };
        
        // Tip selection
        document.querySelectorAll('.tip-btn').forEach(btn => {
            btn.onclick = (e) => {
                const tipPercent = e.target.dataset.tipPercent;
                const fixedTip = e.target.dataset.tip;
                
                if (tipPercent) {
                    this.selectTipPercentage(parseInt(tipPercent));
                } else {
                    this.selectTip(parseInt(fixedTip) || 0);
                }
            };
        });
        
        // Custom tip
        document.getElementById('custom-tip-amount').oninput = (e) => {
            this.selectTip(parseInt(e.target.value) || 0);
            // Remove active class from tip buttons
            document.querySelectorAll('.tip-btn').forEach(btn => btn.classList.remove('active'));
        };
        
        // Proceed with donation
        document.getElementById('proceed-donation').onclick = () => this.processDonation();
        
        // Close modal when clicking outside
        document.getElementById('donation-modal').onclick = (e) => {
            if (e.target.id === 'donation-modal') {
                this.closeDonationModal();
            }
        };
    }

    openDonationModal(campaignId, campaignTitle, campaignDesc) {
        this.currentCampaign = campaignId;
        document.getElementById('donation-campaign-title').textContent = campaignTitle || 'Support This Campaign';
        document.getElementById('donation-campaign-desc').textContent = campaignDesc || '';
        document.getElementById('donation-modal').classList.add('active');
        this.resetForm();
    }

    closeDonationModal() {
        document.getElementById('donation-modal').classList.remove('active');
        this.resetForm();
    }

    selectAmount(amount) {
        this.selectedAmount = amount;
        this.updateAmountButtons(amount);
        this.updateBreakdown();
        this.validateForm();
    }

    selectTip(tipAmount) {
        this.selectedTip = tipAmount;
        this.customTip = tipAmount;
        this.updateTipButtons();
        this.updateBreakdown();
    }

    selectTipPercentage(percentage) {
        this.selectedTip = Math.round((this.selectedAmount * percentage) / 100);
        this.customTip = 0;
        this.updateTipButtons(percentage);
        this.updateBreakdown();
    }

    updateAmountButtons(selectedAmount) {
        document.querySelectorAll('.amount-btn').forEach(btn => {
            const amount = parseInt(btn.dataset.amount);
            btn.classList.toggle('active', amount === selectedAmount);
        });
    }

    updateTipButtons(selectedPercentage = null) {
        document.querySelectorAll('.tip-btn').forEach(btn => {
            const tipPercent = btn.dataset.tipPercent;
            const fixedTip = btn.dataset.tip;
            
            if (selectedPercentage && tipPercent) {
                btn.classList.toggle('active', parseInt(tipPercent) === selectedPercentage);
            } else if (!selectedPercentage && fixedTip !== undefined) {
                btn.classList.toggle('active', parseInt(fixedTip) === this.selectedTip);
            } else {
                btn.classList.remove('active');
            }
        });
    }

    updateBreakdown() {
        const total = this.selectedAmount + this.selectedTip;
        
        document.getElementById('donation-amount-display').textContent = `₹${this.selectedAmount.toLocaleString()}`;
        document.getElementById('tip-amount-display').textContent = `₹${this.selectedTip.toLocaleString()}`;
        document.getElementById('total-amount-display').textContent = `₹${total.toLocaleString()}`;
        
        // Show/hide tip line
        const tipLine = document.querySelector('.tip-line');
        tipLine.style.display = this.selectedTip > 0 ? 'flex' : 'none';
    }

    validateForm() {
        const isValid = this.selectedAmount >= 50; // Minimum donation of ₹50
        document.getElementById('proceed-donation').disabled = !isValid;
    }

    resetForm() {
        this.selectedAmount = 0;
        this.selectedTip = 0;
        this.customTip = 0;
        
        document.getElementById('custom-amount').value = '';
        document.getElementById('custom-tip-amount').value = '';
        document.getElementById('donor-name').value = '';
        document.getElementById('anonymous-donation').checked = false;
        
        document.querySelectorAll('.amount-btn, .tip-btn').forEach(btn => btn.classList.remove('active'));
        
        this.updateBreakdown();
        this.validateForm();
    }

    async processDonation() {
        if (this.selectedAmount < 50) {
            alert('Minimum donation amount is ₹50');
            return;
        }

        const donorName = document.getElementById('donor-name').value.trim();
        const isAnonymous = document.getElementById('anonymous-donation').checked;

        const donationData = {
            campaignId: this.currentCampaign,
            donationAmount: this.selectedAmount,
            tipAmount: this.selectedTip,
            totalAmount: this.selectedAmount + this.selectedTip,
            donorName: isAnonymous ? 'Anonymous' : (donorName || 'Anonymous'),
            isAnonymous: isAnonymous,
            timestamp: new Date()
        };

        console.log('Processing donation:', donationData);
        
        // Here you would integrate with your payment gateway
        // For now, we'll simulate the process
        try {
            // Show loading state
            const donateBtn = document.getElementById('proceed-donation');
            const originalText = donateBtn.textContent;
            donateBtn.textContent = 'Processing...';
            donateBtn.disabled = true;

            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Success
            alert(`Thank you for your donation of ₹${this.selectedAmount.toLocaleString()}${this.selectedTip > 0 ? ` and your ₹${this.selectedTip.toLocaleString()} tip to support FundFlow!` : '!'}`);
            this.closeDonationModal();

            // Here you would save the donation to your database
            // await this.saveDonation(donationData);

        } catch (error) {
            console.error('Donation processing failed:', error);
            alert('Sorry, there was an error processing your donation. Please try again.');
            
            // Reset button
            const donateBtn = document.getElementById('proceed-donation');
            donateBtn.textContent = 'Donate Now';
            donateBtn.disabled = false;
        }
    }

    // Method to save donation (integrate with your backend)
    async saveDonation(donationData) {
        // Implement your database saving logic here
        // This could integrate with Firebase Firestore or your preferred database
    }
}

// Global function to open donation modal (called from campaign cards)
function openDonationModal(campaignId, campaignTitle = '', campaignDesc = '') {
    if (!window.donationManager) {
        window.donationManager = new DonationManager();
    }
    window.donationManager.openDonationModal(campaignId, campaignTitle, campaignDesc);
}

// Initialize donation manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (!window.donationManager) {
        window.donationManager = new DonationManager();
    }
});