interface StarRatingProps {
  className?: string;
}

export default function StarRating({ className = "" }: StarRatingProps) {
  return (
    <div className={`flex items-center gap-0.5 ${className}`} aria-label="5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 17.3L4.8 21.5 6.2 13.3 0 8.1 8.6 7.3 12 -0.5 15.4 7.3 24 8.1 17.8 13.3 19.2 21.5 12 17.3Z"
            fill="#00B67A"
          />
        </svg>
      ))}
    </div>
  );
}
