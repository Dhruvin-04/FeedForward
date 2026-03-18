'use client'
import { getSocket } from '@/lib/socket'
import React, { useEffect } from 'react'

export default function GeoUpdater({userId}: {userId: string}) {

    let socket = getSocket()

    useEffect(()=>{
        if(!userId) return
        if(!navigator.geolocation) return
        const watcher = navigator.geolocation.watchPosition((position) => {
            const { latitude, longitude } = position.coords
            socket.emit('identity', {
                userId,
                location: {
                    type: "Point",
                    coordinates: [longitude, latitude]
                }
            })
        }, (error) => {
            console.error('Error watching position:', error)
        }, { enableHighAccuracy: true })
        return () => navigator.geolocation.clearWatch(watcher)
    }, [userId])
    
  return null
}

 