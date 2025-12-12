// Prophet Trade Locking - Prevents flickering by locking top trades for 24h
// Only re-locks if a significantly better trade appears (+8 points)

export default function getStableTrades(ticker, currentTopTrades) {
  // Load the last saved "locked" trades from localStorage
  const saved = localStorage.getItem(`prophet_lock_${ticker}`);
  const lastLocked = saved ? JSON.parse(saved) : null;

  if (!lastLocked || !currentTopTrades || currentTopTrades.length === 0) {
    // First run or no trades → lock the current ones
    const newLock = {
      trades: currentTopTrades.slice(0, 3),
      lockedAt: new Date().toISOString(),
      validUntil: new Date(Date.now() + 24*60*60*1000).toISOString() // 24h lock default
    };
    localStorage.setItem(`prophet_lock_${ticker}`, JSON.stringify(newLock));
    return newLock;
  }

  const topScoreNow = currentTopTrades[0]?.scoreData?.score || currentTopTrades[0]?.score || 0;
  const topScoreLocked = lastLocked.trades[0]?.scoreData?.score || lastLocked.trades[0]?.score || 0;

  // Only re-lock if the new #1 trade is 8+ points better (or lock expired)
  const lockExpired = new Date() > new Date(lastLocked.validUntil);
  if (topScoreNow >= topScoreLocked + 8 || lockExpired) {
    const newLock = {
      trades: currentTopTrades.slice(0, 3),
      lockedAt: new Date().toISOString(),
      validUntil: new Date(Date.now() + 24*60*60*1000).toISOString(),
      reason: lockExpired ? "24h refresh" : `+${(topScoreNow - topScoreLocked).toFixed(1)} score jump`
    };
    localStorage.setItem(`prophet_lock_${ticker}`, JSON.stringify(newLock));
    return newLock;
  }

  // Otherwise — return the LOCKED trades (no flicker)
  return { ...lastLocked, stillValid: true };
}