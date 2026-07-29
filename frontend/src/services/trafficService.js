/**
 * Live Traffic Telemetry Service
 * Monitors Kopargaon major road corridors, congestion status, and active road maintenance alerts.
 */

export const getKopargaonTrafficData = () => {
  return {
    overallStatus: 'Moderate', // 'Smooth' | 'Moderate' | 'Heavy'
    overallSpeedAvg: '34 km/h',
    corridors: [
      {
        id: 'c-1',
        name: 'Station Road (Railway Stn - Nagar Naka)',
        status: 'Smooth',
        avgSpeed: '42 km/h',
        delay: '0 mins',
        levelColor: 'bg-emerald-500',
        textColor: 'text-emerald-700 dark:text-emerald-400'
      },
      {
        id: 'c-2',
        name: 'Yeola Naka Chowk & Highway Junction',
        status: 'Moderate Traffic',
        avgSpeed: '22 km/h',
        delay: '4 mins',
        levelColor: 'bg-amber-500',
        textColor: 'text-amber-700 dark:text-amber-400'
      },
      {
        id: 'c-3',
        name: 'Godavari Bridge Approach (Sangamner Road)',
        status: 'Slow / Maintenance',
        avgSpeed: '16 km/h',
        delay: '8 mins',
        levelColor: 'bg-rose-500',
        textColor: 'text-rose-700 dark:text-rose-400'
      },
      {
        id: 'c-4',
        name: 'Shirdi - Kopargaon State Highway 10',
        status: 'Smooth',
        avgSpeed: '55 km/h',
        delay: '0 mins',
        levelColor: 'bg-emerald-500',
        textColor: 'text-emerald-700 dark:text-emerald-400'
      }
    ],
    roadClosures: [
      {
        id: 'rc-1',
        location: 'Ward 4 Main Drainage Pipeline Pipeline Work',
        details: 'One-lane diverted via Manmad Road diversion. Estimated completion: 6:00 PM today.',
        type: 'Municipal Pipeline Work'
      }
    ]
  };
};
