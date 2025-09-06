export const posts = [
  {
    id: 1,
    user: {
      name: "Shadow",
      username: "mattshadow",
      avatar: "https://i.pravatar.cc/40?img=5",
    },
    content: "Hi All, This is my new Exploration, what do you think?",
    timestamp: "Just Now",
    images: [
      "https://picsum.photos/600/400?random=1",
      "https://picsum.photos/600/400?random=2",
    ],
    likes: 4,
    hearts: 2,
    commentsCount: 6,
    comments: [
      {
        id: 1,
        user: {
          name: "Zakky",
          username: "vengeance",
          avatar: "https://i.pravatar.cc/40?img=12",
        },
        content: "@mattshadow | Wow amazing work you have 🔥 !!!",
        replies: [
          {
            id: 2,
            user: {
              name: "Lina",
              username: "linart",
              avatar: "https://i.pravatar.cc/40?img=30",
            },
            content: "Agree! Super creative 🚀",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    user: {
      name: "Sophie",
      username: "sophie_arts",
      avatar: "https://i.pravatar.cc/40?img=20",
    },
    content: "A new painting I finished last night 🌙✨",
    timestamp: "2h ago",
    images: ["https://picsum.photos/600/400?random=3"],
    likes: 12,
    hearts: 6,
    commentsCount: 3,
    comments: [],
  },
  {
    id: 3,
    user: {
      name: "Mark",
      username: "mark_dev",
      avatar: "https://i.pravatar.cc/40?img=8",
    },
    content: "Exploring React animations 🚀🔥",
    timestamp: "5h ago",
    images: [
      "https://picsum.photos/600/400?random=4",
      "https://picsum.photos/600/400?random=5",
      "https://picsum.photos/600/400?random=6",
    ],
    likes: 20,
    hearts: 10,
    commentsCount: 8,
    comments: [],
  },
  {
    id: 4,
    user: {
      name: "Alice",
      username: "alice.designs",
      avatar: "https://i.pravatar.cc/40?img=15",
    },
    content: "Sketching minimal logos 🎨",
    timestamp: "1d ago",
    images: ["https://picsum.photos/600/400?random=7"],
    likes: 7,
    hearts: 3,
    commentsCount: 1,
    comments: [
      {
        id: 3,
        user: {
          name: "Tom",
          username: "tommy",
          avatar: "https://i.pravatar.cc/40?img=40",
        },
        content: "Clean work! Love it 💯",
      },
    ],
  },
];