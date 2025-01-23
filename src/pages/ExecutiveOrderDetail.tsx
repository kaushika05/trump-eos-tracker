import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

const ExecutiveOrderDetail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const order = state?.order;

  if (!order) {
    return <div>Order not found</div>;
  }

  const getForecastColor = (forecast: string) => {
    const forecastValue = parseFloat(forecast.replace('%', ''));
    if (forecastValue <= 40) return 'bg-green-200';
    if (forecastValue <= 80) return 'bg-orange-200';
    return 'bg-red-200';
  };

  const getImpactColor = (impact: number) => {
    const violetShades = ['bg-violet-100', 'bg-violet-200', 'bg-violet-300', 'bg-violet-400', 'bg-violet-500'];
    return violetShades[impact - 1] || 'bg-violet-100';
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <Button 
        variant="ghost" 
        className="flex items-center gap-2"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </Button>

      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-primary">
          <a
            href={order.link}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {order.title}
          </a>
        </h1>

        <div className="flex flex-wrap gap-2">
          {order.categories.map((category: string) => (
            <span
              key={category}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {category}
            </span>
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">TLDR</h2>
            <p className="text-gray-700">{order.tldr}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Status</h2>
            <p className="text-gray-700">{order.status}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Forecast</h2>
            <div className={`p-2 rounded ${getForecastColor(order.forecast)}`}>
              {order.forecast}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Impact</h2>
            <div className={`p-2 rounded ${getImpactColor(order.impact)}`}>
              {order.impact}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveOrderDetail;