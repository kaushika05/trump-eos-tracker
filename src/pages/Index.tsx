import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ExecutiveOrdersTable } from '@/components/ExecutiveOrdersTable';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4">
        <ExecutiveOrdersTable />
      </main>
      <Footer />
    </div>
  );
};

export default Index;