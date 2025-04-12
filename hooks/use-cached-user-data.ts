"use client"

import { useState, useEffect } from "react"
import { getUserActivities } from "@/actions/user-actions"

type CachedData = {
  activities: any[]
  timestamp: number
}

// Cache expiration time (in milliseconds)
const CACHE_EXPIRATION = 5 * 60 * 1000 // 5 minutes

export function useCachedUserData(userId: string | undefined) {
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchData = async (force = false) => {
    if (!userId) {
      setLoading(false)
      return
    }

    // Check if we have cached data
    const cachedDataStr = localStorage.getItem(`user_activities_${userId}`)
    const now = Date.now()

    if (!force && cachedDataStr) {
      try {
        const cachedData: CachedData = JSON.parse(cachedDataStr)

        // Check if cache is still valid
        if (now - cachedData.timestamp < CACHE_EXPIRATION) {
          setActivities(cachedData.activities)
          setLastUpdated(new Date(cachedData.timestamp))
          setLoading(false)
          return
        }
      } catch (err) {
        console.error("Error parsing cached data:", err)
        // Continue to fetch fresh data if cache parsing fails
      }
    }

    // Fetch fresh data
    setLoading(true)
    setError(null)

    try {
      const result = await getUserActivities(userId)

      if (result.success) {
        const activitiesData = result.data || []
        setActivities(activitiesData)

        // Cache the data
        const cacheData: CachedData = {
          activities: activitiesData,
          timestamp: now,
        }
        localStorage.setItem(`user_activities_${userId}`, JSON.stringify(cacheData))

        setLastUpdated(new Date(now))
      } else {
        console.error("Error fetching activities:", result.error)
        setError("Could not load activity data")
      }
    } catch (err) {
      console.error("Error fetching activities:", err)
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  // Initial data fetch
  useEffect(() => {
    fetchData()
  }, [userId])

  return {
    activities,
    loading,
    error,
    lastUpdated,
    refreshData: () => fetchData(true),
  }
}