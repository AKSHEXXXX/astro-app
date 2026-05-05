import { useEffect } from 'react';
import './BlogPost.css';

export default function BlogPost({ post, onBack }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!post) return null;

  return (
    <article className="blog-post">
      <div className="container container--narrow">
        <button onClick={onBack} className="blog-post__back">
          ← Back to Blog
        </button>

        <header className="blog-post__header">
          <span className="blog-post__cat">{post.category}</span>
          <h1 className="blog-post__title">{post.title}</h1>
          <div className="blog-post__meta">
            <span>By {post.author.name}</span>
            <span className="meta-dot">•</span>
            <span>{post.date}</span>
            <span className="meta-dot">•</span>
            <span>{post.readTime}</span>
          </div>
        </header>

        <div 
          className="blog-post__body"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="blog-post__tags">
          {post.tags.map(tag => (
            <span key={tag} className="tag">#{tag}</span>
          ))}
        </div>

        {/* Author Bio Block */}
        <div className="author-block card">
          <div className="author-block__avatar">
            <span style={{ fontSize: '2rem' }}>👨‍💼</span>
          </div>
          <div className="author-block__info">
            <h4 className="author-block__name">{post.author.name}</h4>
            <p className="author-block__bio">{post.author.bio}</p>
          </div>
        </div>

        {/* Book a Reading CTA */}
        <div className="blog-cta card">
          <h3 className="blog-cta__title">Ready to understand your own stars?</h3>
          <p className="blog-cta__text">
            Book a personalized 1-on-1 reading with Shree Ayush Saxena to get deep insights into your birth chart.
          </p>
          <a href="#booking" onClick={onBack} className="btn-gold btn-gold-filled">
            Book a Personal Reading
          </a>
        </div>
      </div>
    </article>
  );
}
