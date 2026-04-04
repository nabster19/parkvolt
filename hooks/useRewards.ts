"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "parkvolt_user_rewards";

export interface UserRewards {
  coins: number;
  totalEarned: number;
  rank: "Bronze" | "Silver" | "Gold" | "Elite";
}

export const useRewards = () => {
  const [rewards, setRewards] = useState<UserRewards>({
    coins: 0,
    totalEarned: 0,
    rank: "Bronze"
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setRewards(JSON.parse(saved));
      } catch (e) { console.error("Bad awards state", e); }
    }
  }, []);

  const saveRewards = (newRewards: UserRewards) => {
    setRewards(newRewards);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newRewards));
  };

  const addCoins = (amount: number) => {
    const newTotal = rewards.totalEarned + amount;
    let rank: UserRewards["rank"] = "Bronze";
    if (newTotal > 5000) rank = "Elite";
    else if (newTotal > 2000) rank = "Gold";
    else if (newTotal > 500) rank = "Silver";

    const nextRewards: UserRewards = {
      ...rewards,
      coins: rewards.coins + amount,
      totalEarned: newTotal,
      rank
    };
    saveRewards(nextRewards);
    return amount;
  };

  const useCoins = (amount: number) => {
    if (rewards.coins < amount) return false;
    const nextRewards: UserRewards = {
      ...rewards,
      coins: rewards.coins - amount
    };
    saveRewards(nextRewards);
    return true;
  };

  const getDiscountValue = (coins: number) => {
    // 100 coins = 10 Rs discount
    return Math.floor(coins / 10);
  };

  return { rewards, addCoins, useCoins, getDiscountValue };
};
