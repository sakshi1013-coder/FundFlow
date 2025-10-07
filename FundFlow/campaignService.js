// Campaign Service - Handles all campaign operations
class CampaignService {
  constructor() {
    this.db = firebase.firestore();
  }

  // Save campaign with specified status
  async saveCampaign(campaignData, status) {
    try {
      const currentUser = firebase.auth().currentUser;
      console.log('CampaignService: Current user when saving:', currentUser);
      console.log('CampaignService: User ID:', currentUser?.uid);

      // Require authentication to save campaigns so they can appear under "My Campaigns"
      if (!currentUser) {
        return { success: false, error: 'Please log in before saving or publishing a campaign.' };
      }
      
      const campaign = {
        ...campaignData,
        status: status,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        publishedAt: status === "published" ? firebase.firestore.FieldValue.serverTimestamp() : null,
        userId: currentUser.uid
      };

      console.log('CampaignService: Saving campaign data:', campaign);
      const docRef = await this.db.collection('campaigns').add(campaign);
      console.log('CampaignService: Campaign saved with ID:', docRef.id);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error saving campaign:', error);
      return { success: false, error: error.message };
    }
  }

  // Get all published campaigns
  async getPublishedCampaigns() {
    try {
      const snapshot = await this.db
        .collection('campaigns')
        .where('status', '==', 'published')
        .orderBy('publishedAt', 'desc')
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting published campaigns:', error);
      return [];
    }
  }

  // Get user's campaigns (both draft and published)
  async getUserCampaigns(userId) {
    try {
      console.log('CampaignService: Getting campaigns for userId:', userId);
      const snapshot = await this.db
        .collection('campaigns')
        .where('userId', '==', userId)
        .get();
      
      console.log('CampaignService: Query snapshot size:', snapshot.size);
      console.log('CampaignService: Query docs:', snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() })));
      
      // Sort client-side by createdAt desc to avoid composite index requirement
      const campaigns = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      campaigns.sort((a, b) => {
        const aTime = a.createdAt?.toMillis?.() || a.createdAt?.seconds * 1000 || 0;
        const bTime = b.createdAt?.toMillis?.() || b.createdAt?.seconds * 1000 || 0;
        return bTime - aTime;
      });
      
      return campaigns;
    } catch (error) {
      console.error('Error getting user campaigns:', error);
      return [];
    }
  }

  // Get campaign by ID
  async getCampaignById(campaignId) {
    try {
      const doc = await this.db.collection('campaigns').doc(campaignId).get();
      if (doc.exists) {
        return { id: doc.id, ...doc.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting campaign:', error);
      return null;
    }
  }

  // Update campaign status
  async updateCampaignStatus(campaignId, status) {
    try {
      const updateData = {
        status: status,
        publishedAt: status === "published" ? firebase.firestore.FieldValue.serverTimestamp() : null
      };
      
      await this.db.collection('campaigns').doc(campaignId).update(updateData);
      return { success: true };
    } catch (error) {
      console.error('Error updating campaign status:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete campaign
  async deleteCampaign(campaignId) {
    try {
      await this.db.collection('campaigns').doc(campaignId).delete();
      return { success: true };
    } catch (error) {
      console.error('Error deleting campaign:', error);
      return { success: false, error: error.message };
    }
  }
}

// Initialize campaign service
const campaignService = new CampaignService();

// Campaign form handling
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('campaignForm');
  if (form) {
    // Function to save campaign with specified status
    async function saveCampaign(status) {
      // Get form values
      const title = form.title.value.trim();
      const goal = parseFloat(form.goal.value);
      const category = form.category.value;
      const location = (form.location ? form.location.value.trim() : '') || '';
      const description = form.description.value.trim();
      const organizerName = form.organizerName.value.trim();
      const relation = form.relation.value.trim();
      const ngo = form.ngo.value.trim();

      // Validate required fields
      if (!title || !goal || !category || !description || !organizerName || !relation) {
        alert('Please fill in all required fields');
        return;
      }

      // Handle file upload
      let uploadedImage = null;
      const fileInput = form.querySelector('input[name="media"]');
      if (fileInput && fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        // For now, we'll use a placeholder. In production, you'd upload to Firebase Storage
        uploadedImage = URL.createObjectURL(file);
      }

      const campaignData = {
        title,
        goal,
        category,
        description,
        organizer: {
          name: organizerName,
          relation,
          ngo
        },
        location,
        uploadedImage: uploadedImage
      };

      const result = await campaignService.saveCampaign(campaignData, status);
      
      if (result.success) {
        if (status === "draft") {
          alert('Campaign saved as draft! ID: ' + result.id);
        } else {
          alert('Campaign published successfully! ID: ' + result.id);
          // Redirect to dashboard after publishing
          setTimeout(() => {
            window.location.href = 'Dashboard.html';
          }, 1000);
        }
        
        // Reset form after successful save
        form.reset();
        document.getElementById('desc-count').textContent = '0';
      } else {
        alert('Error saving campaign: ' + result.error);
      }
    }

    // Handle form submission (for Publish Campaign button)
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      await saveCampaign("published");
    });

    // Handle Save Draft button
    const saveDraftBtn = document.getElementById('saveDraftBtn');
    if (saveDraftBtn) {
      saveDraftBtn.addEventListener('click', async function(e) {
        e.preventDefault();
        await saveCampaign("draft");
      });
    }

    // Handle Preview button
    const previewBtn = document.getElementById('previewBtn');
    if (previewBtn) {
      previewBtn.addEventListener('click', function(e) {
        e.preventDefault();
        alert('Preview functionality coming soon!');
      });
    }
  }
});

// Add sample data function (for testing)
async function addSampleCampaigns() {
  const sampleCampaigns = [
    {
      title: "Help Rahul Recover from Surgery",
      goal: 50000,
      category: "Medical",
      description: "Rahul needs urgent surgery for a heart condition. His family cannot afford the medical expenses. Please help us raise funds for his treatment and recovery.",
      organizer: {
        name: "Priya Sharma",
        relation: "Sister",
        ngo: "Health First Foundation"
      },
      status: "published",
      publishedAt: firebase.firestore.FieldValue.serverTimestamp(),
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      userId: "sample-user-1"
    },
    {
      title: "Education for Underprivileged Children",
      goal: 25000,
      category: "Education",
      description: "We aim to provide quality education to 50 children in rural areas. Funds will be used for books, school supplies, and teacher salaries.",
      organizer: {
        name: "Amit Kumar",
        relation: "Volunteer",
        ngo: "Education for All"
      },
      status: "published",
      publishedAt: firebase.firestore.FieldValue.serverTimestamp(),
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      userId: "sample-user-2"
    },
    {
      title: "Animal Shelter Renovation",
      goal: 30000,
      category: "Animals",
      description: "Our local animal shelter needs urgent renovation to provide better care for rescued animals. Help us create a safe haven for our furry friends.",
      organizer: {
        name: "Sneha Patel",
        relation: "Volunteer",
        ngo: "Paws and Claws Rescue"
      },
      status: "published",
      publishedAt: firebase.firestore.FieldValue.serverTimestamp(),
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      userId: "sample-user-3"
    }
  ];

  try {
    for (const campaign of sampleCampaigns) {
      await campaignService.db.collection('campaigns').add(campaign);
    }
    console.log('Sample campaigns added successfully');
  } catch (error) {
    console.error('Error adding sample campaigns:', error);
  }
}

// Uncomment the line below to add sample data
// addSampleCampaigns();
