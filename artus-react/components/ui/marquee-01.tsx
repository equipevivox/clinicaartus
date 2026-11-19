"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Marquee } from "@/components/ui/marquee-01-utils/marquee";
import { googleProfileRating, googleReviewsUrl, type GoogleReview } from "@/lib/google-reviews";

function GoogleMark() {
  return (
    <svg className="reviews-google-mark" viewBox="0 0 48 48" width="24" height="24" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6C44.4 38.03 46.98 31.89 46.98 24.55Z" />
      <path fill="#FBBC05" d="M10.53 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.19a24.01 24.01 0 0 0 0 21.56l7.98-6.19Z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.9-5.8l-7.73-6C30.03 37.65 27.27 38.5 24 38.5c-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.5 42.62 14.62 48 24 48Z" />
    </svg>
  );
}

function ReviewCard({ name, photoUrl, rating, body }: GoogleReview) {
  const initials = name.trim().split(/\s+/).slice(0, 2).map((word) => Array.from(word)[0]).join("").toLocaleUpperCase("pt-BR");

  return (
    <Card className="reviews-card shadow-none">
      <CardContent className="reviews-card-content">
        <GoogleMark />
        <header className="reviews-author-header">
          <span className="reviews-avatar" aria-hidden="true">
            {initials}
            {photoUrl && (
              <Image
                src={photoUrl}
                alt=""
                width={40}
                height={40}
                unoptimized
                referrerPolicy="no-referrer"
                onError={(event) => { event.currentTarget.hidden = true; }}
              />
            )}
          </span>
          <div>
            <p className="reviews-author">{name}</p>
            <div className="reviews-stars" role="img" aria-label={`${rating} de 5 estrelas`}>
              {Array.from({ length: 5 }, (_, index) => (
                <Star key={index} size={14} fill={index < rating ? "currentColor" : "none"} aria-hidden="true" />
              ))}
            </div>
          </div>
        </header>
        <blockquote>{body}</blockquote>
      </CardContent>
    </Card>
  );
}

export default function TestimonialMarquee({ reviews }: { reviews: readonly GoogleReview[] }) {
  const [manual, setManual] = useState(false);
  const published = reviews.filter(({ rating, body }) => (rating === 4 || rating === 5) && body.trim());
  const hasMarquee = published.length >= 8;
  const midpoint = Math.ceil(published.length / 2);
  const profileRating = googleProfileRating.toLocaleString("pt-BR", { minimumFractionDigits: 1 });

  return (
    <section className="section reviews-section" id="avaliacoes" aria-labelledby="reviews-title">
      <div className="container">
        <div className="reviews-heading" data-reveal>
          <h2 id="reviews-title">Avaliações no Google</h2>
          {hasMarquee && (
            <button className="reviews-control" type="button" onClick={() => setManual((current) => !current)}>
              {manual ? "Ativar rolagem automática" : "Ler no meu ritmo"}
            </button>
          )}
        </div>
        <Card className="reviews-summary shadow-none">
          <CardContent className="reviews-summary-content">
            <GoogleMark />
            <div className="reviews-score">
              <Star size={21} fill="currentColor" aria-hidden="true" />
              <strong>{profileRating}</strong><span>de 5 no Google</span>
            </div>
            <a className="inline-link reviews-link" href={googleReviewsUrl}>
              Ver avaliações no Google <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </CardContent>
        </Card>
        {hasMarquee ? (
          <div className="reviews-lanes">
            <Marquee label="Primeira fileira de avaliações" pauseOnHover manual={manual}>
              {published.slice(0, midpoint).map((review) => <li key={review.id}><ReviewCard {...review} /></li>)}
            </Marquee>
            <Marquee label="Segunda fileira de avaliações" reverse pauseOnHover manual={manual}>
              {published.slice(midpoint).map((review) => <li key={review.id}><ReviewCard {...review} /></li>)}
            </Marquee>
          </div>
        ) : published.length > 0 && (
          <ul className="reviews-static">
            {published.map((review) => <li key={review.id}><ReviewCard {...review} /></li>)}
          </ul>
        )}
      </div>
    </section>
  );
}
