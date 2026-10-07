/* Native images keep the supplied star icon and portraits at their intrinsic size. */
/* eslint-disable @next/next/no-img-element */
import { siteName } from "./site";

const ratings = ["Reviews", "Report Guru", "BestTech"];

const testimonials = [
  { name: "Colton Smith", image: "image-colton.jpg", quote: "We needed the same printed design as the one we had ordered a week prior. Not only did they find the original order, but we also received it in time. Excellent!" },
  { name: "Irene Roberts", image: "image-irene.jpg", quote: "Customer service is always excellent and very quick turn around. Completely delighted with the simplicity of the purchase and the speed of delivery." },
  { name: "Anne Wallace", image: "image-anne.jpg", quote: "Put an order with this company and can only praise them for the very high standard. Will definitely use them again and recommend them to everyone!" },
];

export default function Home() {
  return (
    <div className="page">
      <main>
        <div className="summary">
          <header className="intro">
            <h1>10,000+ of our users love our products.</h1>
            <p>We only provide great products combined with excellent customer service. See what our satisfied customers are saying about our services.</p>
          </header>
          <ul className="ratings" aria-label="Ratings">
            {ratings.map(source => (
              <li key={source} className="rating">
                <span className="stars" aria-hidden="true">
                  {Array.from({ length: 5 }, (_, index) => <img key={index} src="/images/icon-star.svg" width="17" height="16" alt="" />)}
                </span>
                <span className="rating-text">Rated 5 Stars in {source}</span>
              </li>
            ))}
          </ul>
        </div>
        <ul className="testimonials" aria-label="Testimonials">
          {testimonials.map(testimonial => (
            <li key={testimonial.name} className="testimonial">
              <figure>
                <figcaption>
                  <img src={`/images/${testimonial.image}`} width="40" height="40" alt={`${testimonial.name}'s profile photo`} />
                  <span className="buyer"><span className="buyer-name">{testimonial.name}</span> <span className="verified">Verified Buyer</span></span>
                </figcaption>
                <blockquote><p>“ {testimonial.quote} ”</p></blockquote>
              </figure>
            </li>
          ))}
        </ul>
      </main>
      <footer><span className="site-name">{siteName}</span>. Challenge by <a href="https://www.frontendmentor.io/challenges/social-proof-section-6e0qTv_bA">Frontend Mentor</a>. Built by <a href="https://royeradames.com">Royer Adames</a>.</footer>
    </div>
  );
}
