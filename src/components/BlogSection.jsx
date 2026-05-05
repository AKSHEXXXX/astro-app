import { BLOG_POSTS } from '../data/blogData.js';
import './BlogSection.css';

export default function BlogSection({ onSelectPost }) {
  return (
    <section id="blog" className="blog-section">
      <div className="container">
        <div className="blog-section__header">
          <span className="section-label">✦ COSMIC INSIGHTS ✦</span>
          <h2 className="section-title">From the Astrologer's Desk</h2>
          <p className="blog-section__sub">Weekly horoscopes · Dasha guides · Planetary transits</p>
        </div>

        <div className="blog-grid">
          {BLOG_POSTS.map((post) => (
            <div 
              key={post.id} 
              className="blog-card card" 
              onClick={() => onSelectPost(post.slug)}
            >
              <div className="blog-card__icon-wrap">
                <span className="blog-card__icon">{post.icon}</span>
              </div>
              <div className="blog-card__content">
                <span className="blog-card__cat">{post.category}</span>
                <h3 className="blog-card__title">{post.title}</h3>
                <div className="blog-card__meta">
                  <span>{post.date}</span>
                  <span className="meta-dot">•</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="blog-section__footer">
          <button className="view-all-link">
            View all articles <span className="arrow">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
