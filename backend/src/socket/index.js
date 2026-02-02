import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Match from '../models/Match.js';

// Store active connections
const activeUsers = new Map(); // userId -> socketId
const matchRooms = new Map(); // matchId -> Set of socketIds

export const setupSocketHandlers = (io) => {
  // Authentication middleware for Socket.io
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication required'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user.id;
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.user.username} (${socket.userId})`);
    
    // Store active connection
    activeUsers.set(socket.userId, socket.id);
    socket.join(`user_${socket.userId}`);

    // Join match room
    socket.on('join_match', async (data) => {
      try {
        const { matchId } = data;
        
        // Verify user is part of this match
        const match = await Match.findById(matchId);
        
        if (!match) {
          socket.emit('error', { message: 'Match not found' });
          return;
        }

        if (match.player1_id !== socket.userId && match.player2_id !== socket.userId) {
          socket.emit('error', { message: 'Access denied' });
          return;
        }

        // Join match room
        socket.join(`match_${matchId}`);
        
        // Track room membership
        if (!matchRooms.has(matchId)) {
          matchRooms.set(matchId, new Set());
        }
        matchRooms.get(matchId).add(socket.id);

        console.log(`👥 User ${socket.user.username} joined match ${matchId}`);

        // Notify opponent that user joined
        const opponentId = match.player1_id === socket.userId 
          ? match.player2_id 
          : match.player1_id;

        io.to(`user_${opponentId}`).emit('opponent_joined', {
          username: socket.user.username,
          rating: socket.user.rating
        });

        // Send match ready if both players are connected
        const matchRoom = matchRooms.get(matchId);
        if (matchRoom && matchRoom.size === 2) {
          io.to(`match_${matchId}`).emit('match_ready', {
            matchId,
            message: 'Both players connected. Match starting!'
          });
        }

        socket.emit('joined_match', { matchId });
      } catch (error) {
        console.error('Error joining match:', error);
        socket.emit('error', { message: 'Failed to join match' });
      }
    });

    // Leave match room
    socket.on('leave_match', (data) => {
      const { matchId } = data;
      socket.leave(`match_${matchId}`);
      
      const matchRoom = matchRooms.get(matchId);
      if (matchRoom) {
        matchRoom.delete(socket.id);
        if (matchRoom.size === 0) {
          matchRooms.delete(matchId);
        }
      }

      console.log(`👋 User ${socket.user.username} left match ${matchId}`);
    });

    // Typing indicator
    socket.on('typing', (data) => {
      const { matchId } = data;
      socket.to(`match_${matchId}`).emit('opponent_typing', {
        userId: socket.userId,
        username: socket.user.username
      });
    });

    // Stop typing indicator
    socket.on('stop_typing', (data) => {
      const { matchId } = data;
      socket.to(`match_${matchId}`).emit('opponent_stop_typing', {
        userId: socket.userId
      });
    });

    // Code submission notification
    socket.on('code_submitted', (data) => {
      const { matchId } = data;
      socket.to(`match_${matchId}`).emit('opponent_submitted', {
        userId: socket.userId,
        username: socket.user.username,
        timestamp: new Date()
      });
    });

    // Test run notification
    socket.on('running_tests', (data) => {
      const { matchId } = data;
      socket.to(`match_${matchId}`).emit('opponent_testing', {
        userId: socket.userId,
        username: socket.user.username
      });
    });

    // Chat message in match
    socket.on('match_message', (data) => {
      const { matchId, message } = data;
      
      io.to(`match_${matchId}`).emit('match_message', {
        userId: socket.userId,
        username: socket.user.username,
        message,
        timestamp: new Date()
      });
    });

    // Request rematch
    socket.on('request_rematch', async (data) => {
      try {
        const { matchId } = data;
        const match = await Match.findById(matchId);
        
        if (!match) return;

        const opponentId = match.player1_id === socket.userId 
          ? match.player2_id 
          : match.player1_id;

        io.to(`user_${opponentId}`).emit('rematch_requested', {
          username: socket.user.username,
          matchId
        });

        socket.emit('rematch_request_sent');
      } catch (error) {
        console.error('Error requesting rematch:', error);
      }
    });

    // Accept rematch
    socket.on('accept_rematch', (data) => {
      const { matchId } = data;
      socket.to(`match_${matchId}`).emit('rematch_accepted', {
        username: socket.user.username
      });
    });

    // Heartbeat/ping to keep connection alive
    socket.on('ping', () => {
      socket.emit('pong');
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.user.username}`);
      
      // Remove from active users
      activeUsers.delete(socket.userId);

      // Clean up match rooms
      for (const [matchId, sockets] of matchRooms.entries()) {
        if (sockets.has(socket.id)) {
          sockets.delete(socket.id);
          
          // Notify opponent
          socket.to(`match_${matchId}`).emit('opponent_disconnected', {
            userId: socket.userId,
            username: socket.user.username
          });

          if (sockets.size === 0) {
            matchRooms.delete(matchId);
          }
        }
      }
    });

    // Error handling
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  console.log('📡 Socket.io handlers configured');
};

// Helper function to get online users count
export const getOnlineUsersCount = () => {
  return activeUsers.size;
};

// Helper function to check if user is online
export const isUserOnline = (userId) => {
  return activeUsers.has(userId);
};

// Helper function to get active matches count
export const getActiveMatchesCount = () => {
  return matchRooms.size;
};
