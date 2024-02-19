// routes/bankRoutes.js
const express = require('express');
const { requireAuth } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const router = express.Router();

//getting the users
router.get('/', requireAuth, async (req, res) => {
  const userId = req.user.userId;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const usernames = user.username;
      res.json({ usernames });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
 } )

 //gettting balance
router.get('/balance', requireAuth, async (req, res) => {
    const userId = req.user.userId;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const balance = user.balance;
      res.json({ balance });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

  router.post('/transfer', requireAuth, async (req, res) => {
    const userId = req.user.userId;
    const { recipientPhoneNumber, amount } = req.body;
  console.log(recipientPhoneNumber,amount);
    try {
      // Retrieve sender's account
      const sender = await User.findById(userId);
      if (!sender) {
        return res.status(404).json({ message: 'Sender not found' });
      }
  
      // Deduct transferred amount from sender's balance
      if (sender.balance < amount) {
        return res.status(400).json({ message: 'Insufficient balance' });
      }
      sender.balance -= amount;
      await sender.save();
  
      // Retrieve recipient's account based on phone number
      const recipient = await User.findOne({ phonenumber: recipientPhoneNumber });
      console.log("recipient",recipient);
      if (!recipient) {
        return res.status(404).json({ message: 'Recipient not found' });
      }
  
      // Add transferred amount to recipient's balance
      recipient.balance = Number(recipient.balance) + Number(amount);
      await recipient.save();

      // Log transaction
      const transaction = new Transaction({
        sender: userId,
        phonenumber: recipientPhoneNumber, // Use recipient's phone number
        amount
      });
      await transaction.save();
  
      res.json({ message: 'Funds transferred successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  
// Get user's transactions
router.get('/transactions', requireAuth, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Fetch transactions where the sender or recipient is the user
    const transactions = await Transaction.find({
      $or: [{ sender: userId }, { recipient: userId }],
    }).sort({ timestamp: -1 });

    res.json({ transactions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add more banking operations endpoints as needed...
router.runtime = "nodejs16.x";
module.exports = router;
