'use client'

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Comment } from "./Comment";

export const PostDisplay = ({ post }: { post: any }) => {
  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  return (
    <div className="m-6 w-[550px] bg-gray-800 rounded-xl p-4 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <img
            src={post.user.avatar}
            alt="avatar"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-semibold text-sm">{post.user.name}</p>
            <p className="text-gray-400 text-xs">@{post.user.username}</p>
          </div>
        </div>
        <span className="text-xs text-gray-500">{post.timestamp}</span>
      </div>

      {/* Content */}
      <p className="mb-3 text-sm">{post.content}</p>

      {/* Images as carousel */}
      {post.images.length > 0 && (
        <div className="mb-3">
          <Slider {...sliderSettings}>
            {post.images.map((img: string, i: number) => (
              <div key={i}>
                <img
                  src={img}
                  alt="post"
                  className="w-full h-[350px] object-cover rounded-lg"
                />
              </div>
            ))}
          </Slider>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center space-x-6 text-gray-400 text-sm mb-3">
        <button className="hover:text-blue-400">👍 {post.likes}</button>
        <button className="hover:text-red-400">❤️ {post.hearts}</button>
        <button className="hover:text-green-400">💬 {post.commentsCount}</button>
        <button className="hover:text-yellow-400">📤</button>
      </div>

      {/* Comments */}
      <div className="space-y-3">
        {post.comments.map((comment: any) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
};