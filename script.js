// ============================================================
//  script.js
//  Shared utility functions for Chess Tournament Scoreboard
//
//  NOTE: Most logic lives in the HTML files as ES modules
//  because each page needs different Firebase imports.
//  This file provides shared helpers that can be imported
//  or used globally if needed.
// ============================================================

/**
 * Show a toast notification
 * @param {string} msg   - Message to display
 * @param {string} type  - 'success' | 'error' | 'info'
 */
function showToast(msg, type = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.className = `show toast-${type}`;
    clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(() => { toast.className = ''; }, 3000);
}

/**
 * Format a Firestore Timestamp to a readable date string
 * @param {object} timestamp - Firestore Timestamp object
 * @returns {string}
 */
function formatDate(timestamp) {
    if (!timestamp?.toDate) return 'Unknown date';
    return timestamp.toDate().toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric'
    });
}

/**
 * Shuffle an array in place using Fisher-Yates algorithm
 * Used for randomizing player order in knockout brackets
 * @param {Array} arr
 * @returns {Array} shuffled array
 */
function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

/**
 * Generate all round-robin match pairs for a league tournament
 * Every player plays every other player exactly once
 * @param {string[]} players - Array of player names
 * @returns {object[]} Array of match objects
 */
function generateRoundRobinMatches(players) {
    const matches = [];
    let matchNum = 1;

    for (let i = 0; i < players.length; i++) {
        for (let j = i + 1; j < players.length; j++) {
            matches.push({
                id: `m${matchNum++}`,
                player1: players[i],
                player2: players[j],
                result: null
            });
        }
    }
    return matches;
}

/**
 * Generate knockout bracket matches from a shuffled player list
 * Adds BYE for odd number of players
 * @param {string[]} players - Array of player names
 * @returns {object[]} Array of match objects
 */
function generateKnockoutBracket(players) {
    const shuffled = shuffleArray(players);
    const matches = [];
    let round = 1;

    if (shuffled.length % 2 !== 0) shuffled.push('BYE');

    for (let i = 0; i < shuffled.length; i += 2) {
        const isBye = shuffled[i + 1] === 'BYE';
        matches.push({
            id: `r${round}_m${Math.floor(i / 2) + 1}`,
            round,
            player1: shuffled[i],
            player2: shuffled[i + 1],
            winner: isBye ? shuffled[i] : null,
            result: isBye ? 'bye' : null
        });
    }
    return matches;
}

/**
 * Calculate league standings from match results
 * Scoring: Win = 1pt, Draw = 0.5pt, Loss = 0pt
 * Sorted by points desc, then wins desc
 * @param {string[]} players
 * @param {object[]} matches
 * @returns {object[]} Sorted standings array
 */
function calculateStandings(players, matches) {
    const stats = {};
    players.forEach(p => {
        stats[p] = { name: p, played: 0, wins: 0, draws: 0, losses: 0, points: 0 };
    });

    matches.forEach(match => {
        if (!match.result) return;

        const { player1: p1, player2: p2, result } = match;

        if (result === 'player1') {
            stats[p1].played++; stats[p1].wins++; stats[p1].points += 1;
            stats[p2].played++; stats[p2].losses++;
        } else if (result === 'player2') {
            stats[p2].played++; stats[p2].wins++; stats[p2].points += 1;
            stats[p1].played++; stats[p1].losses++;
        } else if (result === 'draw') {
            stats[p1].played++; stats[p1].draws++; stats[p1].points += 0.5;
            stats[p2].played++; stats[p2].draws++; stats[p2].points += 0.5;
        }
    });

    return Object.values(stats).sort((a, b) =>
        b.points !== a.points ? b.points - a.points : b.wins - a.wins
    );
}

/**
 * Convert Firebase auth error codes to friendly messages
 * @param {string} code - Firebase error code
 * @returns {string} Human-readable error message
 */
function friendlyAuthError(code) {
    const messages = {
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password. Please try again.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/email-already-in-use': 'An account with this email already exists.',
        'auth/weak-password': 'Password must be at least 6 characters.',
        'auth/too-many-requests': 'Too many failed attempts. Please wait and try again.',
        'auth/network-request-failed': 'Network error. Check your internet connection.',
        'auth/invalid-credential': 'Invalid email or password. Please check and try again.',
    };
    return messages[code] || `Authentication error: ${code}`;
}

// Export for use in ES module contexts (if needed)
// In plain script tags, these are globally available
if (typeof module !== 'undefined') {
    module.exports = {
        showToast,
        formatDate,
        shuffleArray,
        generateRoundRobinMatches,
        generateKnockoutBracket,
        calculateStandings,
        friendlyAuthError
    };
}
