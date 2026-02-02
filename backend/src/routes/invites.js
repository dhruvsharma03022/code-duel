import express from 'express';
import Invite from '../models/Invite.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Create invite link
router.post('/', auth, async (req, res, next) => {
  try {
    const expiryHours = parseInt(req.body.expiryHours) || 24;
    
    if (expiryHours < 1 || expiryHours > 168) { // Max 1 week
      return res.status(400).json({ error: 'Expiry must be between 1 and 168 hours' });
    }

    const invite = await Invite.create(req.userId, expiryHours);

    res.status(201).json({
      message: 'Invite created successfully',
      invite: {
        inviteCode: invite.invite_code,
        inviteUrl: `${process.env.FRONTEND_URL}/join/${invite.invite_code}`,
        expiresAt: invite.expires_at,
        createdAt: invite.created_at
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get invite details (without auth for joining users)
router.get('/:inviteCode', async (req, res, next) => {
  try {
    const { inviteCode } = req.params;
    const validation = await Invite.isValid(inviteCode);

    if (!validation.valid) {
      return res.status(400).json({ 
        error: validation.reason,
        valid: false 
      });
    }

    const invite = validation.invite;

    res.json({
      valid: true,
      invite: {
        creatorUsername: invite.creator_username,
        creatorRating: invite.creator_rating,
        expiresAt: invite.expires_at
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get user's created invites
router.get('/me/invites', auth, async (req, res, next) => {
  try {
    const invites = await Invite.getByCreator(req.userId);

    const formattedInvites = invites.map(invite => ({
      inviteCode: invite.invite_code,
      inviteUrl: `${process.env.FRONTEND_URL}/join/${invite.invite_code}`,
      createdAt: invite.created_at,
      expiresAt: invite.expires_at,
      usedAt: invite.used_at,
      matchId: invite.match_id,
      status: invite.used_at ? 'used' : 
              (new Date(invite.expires_at) < new Date() ? 'expired' : 'active')
    }));

    res.json({
      invites: formattedInvites,
      total: formattedInvites.length
    });
  } catch (error) {
    next(error);
  }
});

// Delete expired invites (admin/cleanup endpoint)
router.delete('/cleanup/expired', async (req, res, next) => {
  try {
    const deleted = await Invite.deleteExpired();
    
    res.json({
      message: 'Expired invites deleted',
      count: deleted.length
    });
  } catch (error) {
    next(error);
  }
});

export default router;
