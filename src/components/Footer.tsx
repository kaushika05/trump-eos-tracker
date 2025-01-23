import React from 'react';

export const Footer = () => {
  return (
    <footer className="mt-12 py-6 border-t">
      <p className="text-center text-sm text-muted-foreground">
        Not affiliated with the US government.{" "}
        <a 
          href="https://github.com/kaushika05/trump-eos-tracker"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-primary"
        >
          View full code here
        </a>
      </p>
    </footer>
  );
};