import React from 'react';

export const Footer = () => {
  return (
    <footer className="mt-8 py-4 border-t">
      <div className="text-center text-sm text-muted-foreground">
        <a 
          href="https://github.com/yourusername/trump-executive-orders"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-primary"
        >
          GitHub Repo
        </a>
      </div>
    </footer>
  );
};