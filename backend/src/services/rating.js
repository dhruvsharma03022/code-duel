class RatingService {
  /**
   * Calculate new ELO ratings for both players
   * @param {number} winnerRating - Current rating of winner
   * @param {number} loserRating - Current rating of loser
   * @param {number} kFactor - K-factor for rating change sensitivity (default: 32)
   * @returns {object} - New ratings for both players
   */
  static calculateEloRatings(winnerRating, loserRating, kFactor = 32) {
    // Calculate expected scores
    const expectedWinner = this.getExpectedScore(winnerRating, loserRating);
    const expectedLoser = this.getExpectedScore(loserRating, winnerRating);

    // Calculate new ratings
    // Winner gets actual score of 1, loser gets 0
    const newWinnerRating = Math.round(winnerRating + kFactor * (1 - expectedWinner));
    const newLoserRating = Math.round(loserRating + kFactor * (0 - expectedLoser));

    // Ensure ratings don't go below a minimum (e.g., 100)
    const minRating = 100;

    return {
      newWinnerRating: Math.max(newWinnerRating, minRating),
      newLoserRating: Math.max(newLoserRating, minRating),
      winnerChange: Math.max(newWinnerRating, minRating) - winnerRating,
      loserChange: Math.max(newLoserRating, minRating) - loserRating
    };
  }

  /**
   * Calculate expected score for a player
   * @param {number} playerRating - Rating of the player
   * @param {number} opponentRating - Rating of the opponent
   * @returns {number} - Expected score (probability of winning)
   */
  static getExpectedScore(playerRating, opponentRating) {
    return 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
  }

  /**
   * Get K-factor based on rating and number of games played
   * Higher K-factor for beginners, lower for established players
   * @param {number} rating - Player's current rating
   * @param {number} gamesPlayed - Number of games played
   * @returns {number} - K-factor
   */
  static getKFactor(rating, gamesPlayed) {
    // High K-factor for new players (faster rating changes)
    if (gamesPlayed < 30) {
      return 40;
    }
    
    // Medium K-factor for intermediate players
    if (rating < 2400) {
      return 32;
    }
    
    // Lower K-factor for established high-rated players
    return 24;
  }

  /**
   * Calculate rating change with dynamic K-factor
   * @param {number} winnerRating - Current rating of winner
   * @param {number} loserRating - Current rating of loser
   * @param {number} winnerGamesPlayed - Games played by winner
   * @param {number} loserGamesPlayed - Games played by loser
   * @returns {object} - New ratings for both players
   */
  static calculateDynamicRatings(winnerRating, loserRating, winnerGamesPlayed, loserGamesPlayed) {
    const winnerK = this.getKFactor(winnerRating, winnerGamesPlayed);
    const loserK = this.getKFactor(loserRating, loserGamesPlayed);

    const expectedWinner = this.getExpectedScore(winnerRating, loserRating);
    const expectedLoser = this.getExpectedScore(loserRating, winnerRating);

    const newWinnerRating = Math.round(winnerRating + winnerK * (1 - expectedWinner));
    const newLoserRating = Math.round(loserRating + loserK * (0 - expectedLoser));

    const minRating = 100;

    return {
      newWinnerRating: Math.max(newWinnerRating, minRating),
      newLoserRating: Math.max(newLoserRating, minRating),
      winnerChange: Math.max(newWinnerRating, minRating) - winnerRating,
      loserChange: Math.max(newLoserRating, minRating) - loserRating,
      winnerKFactor: winnerK,
      loserKFactor: loserK
    };
  }

  /**
   * Get rating tier/rank name
   * @param {number} rating - Player's rating
   * @returns {string} - Rank name
   */
  static getRankName(rating) {
    if (rating < 800) return 'Bronze';
    if (rating < 1200) return 'Silver';
    if (rating < 1600) return 'Gold';
    if (rating < 2000) return 'Platinum';
    if (rating < 2400) return 'Diamond';
    if (rating < 2800) return 'Master';
    return 'Grandmaster';
  }

  /**
   * Calculate percentile ranking
   * @param {number} rating - Player's rating
   * @param {Array} allRatings - Array of all player ratings
   * @returns {number} - Percentile (0-100)
   */
  static calculatePercentile(rating, allRatings) {
    const sorted = [...allRatings].sort((a, b) => a - b);
    const index = sorted.findIndex(r => r >= rating);
    
    if (index === -1) return 100;
    
    return Math.round((index / sorted.length) * 100);
  }
}

export default RatingService;
