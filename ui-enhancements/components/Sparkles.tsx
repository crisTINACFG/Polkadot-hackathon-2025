export function Sparkles() {
    return (
      <div className="sparkles">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              transform: `scale(${Math.random() * 0.5 + 0.5})`
            }}
          >✨</div>
        ))}
      </div>
    );
  }