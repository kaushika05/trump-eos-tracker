import React from 'react';

export const Header = () => {
  return (
    <header className="space-y-6 mb-8">
      <div>
        <div className="disclaimer">
          This is <span className="text-red-600 font-semibold">NOT</span> an official website of the US government.
        </div>
        <div className="disclaimer">
          Visit{" "}
          <a 
            href="https://www.whitehouse.gov/presidential-actions/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="underline hover:text-primary/80"
          >
            https://www.whitehouse.gov/presidential-actions/
          </a>{" "}
          for official information
        </div>
      </div>
      
      <h1 className="text-3xl md:text-4xl font-bold text-center px-4 text-primary">
        Track all executive orders signed by President Donald J. Trump during his second presidency
      </h1>
      
      <p className="text-lg text-center text-muted-foreground px-4">
        Filter by category and find out how it'll impact you
      </p>
    </header>
  );
};