export const user = {
  name: 'Cristal Parker',
  picture:
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YXZhdGFyfGVufDB8fDB8fHww',
}

export const channels = [
  {
    id: 'room01',
    avatar_path:
      'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    name: 'Bill Kuphal',
    latest_message: 'The weather will be perfect for go to camping',
    time: '9:41 AM',
  },
  {
    id: 'room02',
    avatar_path:
      'https://plus.unsplash.com/premium_photo-1658527049634-15142565537a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YXZhdGFyfGVufDB8fDB8fHww',
    name: 'Photograper',
    latest_message: "Here's my latest drone shotsHere's my latest drone shots",
    time: '9:16 AM',
  },
]

export const messages = [
  {
    id: 1,
    userId: 'u123',
    avatar_path:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YXZhdGFyfGVufDB8fDB8fHww',
    name: 'Cristal Parker',
    message:
      "Hey Bob, I've been trying to set up Redis for our caching layer. Do you have any experience with it?",
    timestamp: '2024-06-09T08:00:00Z',
  },
  {
    id: 2,
    userId: 'u456',
    avatar_path:
      'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    name: 'Bill Kuphal',
    message:
      "Yes, I've used Redis quite a bit. What are you trying to do exactly?",
    timestamp: '2024-06-09T08:01:30Z',
  },
  {
    id: 3,
    userId: 'u123',
    avatar_path:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YXZhdGFyfGVufDB8fDB8fHww',
    name: 'Cristal Parker',
    message:
      "I'm trying to configure it to handle session storage for our web application. Any tips?",
    timestamp: '2024-06-09T08:03:00Z',
  },
  {
    id: 4,
    userId: 'u456',
    avatar_path:
      'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    name: 'Bill Kuphal',
    message:
      'You can definitely use Redis for session storage. Make sure you set the appropriate eviction policy to manage the memory effectively.',
    timestamp: '2024-06-09T08:04:30Z',
  },
  {
    id: 5,
    userId: 'u123',
    avatar_path:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YXZhdGFyfGVufDB8fDB8fHww',
    name: 'Cristal Parker',
    message: 'Got it. Which eviction policy would you recommend?',
    timestamp: '2024-06-09T08:05:00Z',
  },
  {
    id: 6,
    userId: 'u456',
    avatar_path:
      'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    name: 'Bill Kuphal',
    message:
      "For session storage, I usually go with the 'allkeys-lru' policy. It evicts the least recently used keys first, which is great for maintaining active sessions.",
    timestamp: '2024-06-09T08:06:15Z',
  },
  {
    id: 7,
    userId: 'u123',
    avatar_path:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YXZhdGFyfGVufDB8fDB8fHww',
    name: 'Cristal Parker',
    message:
      "Thanks! I'll set that up. Also, any best practices for setting up Redis security?",
    timestamp: '2024-06-09T08:07:30Z',
  },
  {
    id: 8,
    userId: 'u456',
    avatar_path:
      'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    name: 'Bill Kuphal',
    message:
      'Definitely. Ensure you enable authentication with a strong password and configure your Redis instance to only accept connections from trusted hosts.',
    timestamp: '2024-06-09T08:08:45Z',
  },
  {
    id: 9,
    userId: 'u123',
    avatar_path:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YXZhdGFyfGVufDB8fDB8fHww',
    name: 'Cristal Parker',
    message:
      "Great advice. I'll make those changes. Anything else I should watch out for?",
    timestamp: '2024-06-09T08:09:30Z',
  },
  {
    id: 10,
    userId: 'u456',
    avatar_path:
      'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    name: 'Bill Kuphal',
    message:
      'Just keep an eye on the memory usage and set alerts for any unusual activity. Redis is powerful, but it needs monitoring.',
    timestamp: '2024-06-09T08:10:15Z',
  },
  {
    id: 11,
    userId: 'u123',
    avatar_path:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YXZhdGFyfGVufDB8fDB8fHww',
    name: 'Cristal Parker',
    message: 'Will do. Thanks a lot for your help, Bob!',
    timestamp: '2024-06-09T08:11:00Z',
  },
  {
    id: 12,
    userId: 'u456',
    avatar_path:
      'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    name: 'Bill Kuphal',
    message: 'Anytime, Alice. Good luck with the setup!',
    timestamp: '2024-06-09T08:11:30Z',
  },
]
