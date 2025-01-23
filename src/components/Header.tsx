import React from 'react';
import { ThemeToggle } from './ThemeToggle';

export const Header = () => {
  return (
    <header className="space-y-4 mb-6">
      <div>
        <div className="disclaimer">
          This is not an official website. Visit{" "}
          <a 
            href="https://www.whitehouse.gov/presidential-actions/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="underline hover:text-primary/80"
          >
            wh.gov
          </a>{" "}
          for official information.
        </div>
      </div>
      
      <h1 className="text-3xl md:text-4xl font-bold text-center px-4 text-primary">
        Trump's Executive Orders
      </h1>
      
      <p className="text-lg text-center text-muted-foreground">
        Filter by category and find out how it'll impact you
      </p>

      <div className="flex justify-center">
        <ThemeToggle />
      </div>
    </header>
  );
};