import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  Package,
  Truck,
  Check,
  XCircle,
  ChevronDown,
  ChevronUp,
  MapPin,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { OrderStatus } from '../types/microservices';

interface Props {
  status: OrderStatus;
  orderId: string;
  createdAt: string;
  estimatedDelivery?: string;
  destinationCity?: string;
}

export const OrderTrackingStepper: React.FC<Props> = ({
  status,
  orderId,
  createdAt,
  estimatedDelivery,
  destinationCity = 'Mumbai'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // If order is cancelled, show cancellation status
  if (status === 'Cancelled') {
    return (
      <div className="bg-rose-50/70 border border-rose-200/80 rounded-2xl p-4 text-xs text-rose-800 space-y-2">
        <div className="flex items-center gap-2 font-bold text-rose-900">
          <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>Order Cancelled</span>
        </div>
        <p className="text-[11px] text-rose-700 leading-relaxed">
          This order was cancelled. If payment was completed via UPI or Card, a full refund has been initiated to your source account and will reflect in 3–5 business days.
        </p>
      </div>
    );
  }

  // 4 Main Stepper Milestones
  const steps = [
    {
      id: 'Pending',
      label: 'Order Placed',
      description: 'Payment confirmed & order received',
      icon: Clock
    },
    {
      id: 'Confirmed',
      label: 'Order Confirmed',
      description: 'Verified & packed at warehouse',
      icon: CheckCircle2
    },
    {
      id: 'Shipped',
      label: 'On the Way',
      description: 'Handed over to express courier',
      icon: Truck
    },
    {
      id: 'Delivered',
      label: 'Delivered',
      description: 'Delivered to your doorstep',
      icon: Package
    }
  ];

  // Map application OrderStatus to numeric index (0 to 3)
  const getStepIndex = (s: OrderStatus): number => {
    switch (s) {
      case 'Pending':
        return 0;
      case 'Confirmed':
      case 'Processing':
        return 1;
      case 'Shipped':
        return 2;
      case 'Delivered':
        return 3;
      default:
        return 1;
    }
  };

  const currentStepIndex = getStepIndex(status);

  // Generated tracking milestones for the expandable log
  const orderDate = new Date(createdAt);
  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });

  const milestones = [
    {
      title: 'Order Confirmed & Placed',
      location: 'Stella Online Portal',
      time: formatDate(orderDate),
      completed: currentStepIndex >= 0
    },
    {
      title: 'Item Packed & Quality Verified',
      location: 'Stella Central Hub, Bhiwandi, Maharashtra',
      time: formatDate(new Date(orderDate.getTime() + 1000 * 60 * 60 * 6)),
      completed: currentStepIndex >= 1
    },
    {
      title: 'Handed to Express Courier Partner',
      location: 'Delhivery Surface Logistics Hub',
      time: formatDate(new Date(orderDate.getTime() + 1000 * 60 * 60 * 24)),
      completed: currentStepIndex >= 2
    },
    {
      title: `Delivered to Destination (${destinationCity})`,
      location: `Doorstep Delivery, ${destinationCity}`,
      time: estimatedDelivery || 'Estimated Soon',
      completed: currentStepIndex >= 3
    }
  ];

  return (
    <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-800 tracking-tight">
            Order Status: <strong className="text-teal-600 font-extrabold">{status}</strong>
          </span>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[11px] font-semibold text-slate-600 hover:text-teal-600 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>{isExpanded ? 'Hide Live Tracking' : 'Live Tracking & Courier Info'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Stepper Progress Bar */}
      <div className="relative pt-2 pb-2">
        {/* Background Connecting Bar */}
        <div className="absolute top-6 left-6 right-6 h-1 bg-slate-200 -translate-y-1/2 rounded-full z-0" />

        {/* Active Filled Progress Bar */}
        <div
          className="absolute top-6 left-6 h-1 bg-teal-500 -translate-y-1/2 rounded-full transition-all duration-500 z-0"
          style={{
            width: `${Math.min(100, (currentStepIndex / (steps.length - 1)) * (100 - 10))}%`
          }}
        />

        {/* Steps Grid */}
        <div className="relative z-10 grid grid-cols-4 gap-2">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            const isUpcoming = idx > currentStepIndex;

            const IconComponent = step.icon;

            return (
              <div key={step.id} className="flex flex-col items-center text-center">
                {/* Node Circle */}
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-xs ${
                    isCompleted
                      ? 'bg-teal-500 text-white ring-4 ring-teal-100'
                      : isCurrent
                      ? 'bg-teal-600 text-white ring-4 ring-teal-200 animate-pulse'
                      : 'bg-white text-slate-400 border-2 border-slate-200'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : (
                    <IconComponent className="w-4 h-4" />
                  )}
                </div>

                {/* Step Label */}
                <span
                  className={`text-[11px] font-bold mt-2 leading-tight ${
                    isCurrent
                      ? 'text-teal-700'
                      : isCompleted
                      ? 'text-slate-800'
                      : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>

                {/* Subtitle / Delivery ETA */}
                <span className="text-[10px] text-slate-400 hidden sm:block mt-0.5 max-w-[100px] leading-tight">
                  {isCurrent && estimatedDelivery && idx === 3
                    ? estimatedDelivery
                    : step.description}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expandable Live Tracking Timeline */}
      {isExpanded && (
        <div className="pt-3 border-t border-slate-200/80 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-500 pb-1 gap-1">
            <span>
              Courier Partner: <strong className="text-slate-800 font-semibold">Delhivery Express Surface</strong>
            </span>
            <span className="font-mono">
              AWB: <strong className="text-slate-800">DEL{orderId.replace(/[^0-9]/g, '')}89IN</strong>
            </span>
          </div>

          <div className="space-y-3 pl-2">
            {milestones.map((m, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div
                  className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${
                    m.completed ? 'bg-teal-500' : 'bg-slate-300'
                  }`}
                />
                <div className="text-xs">
                  <span
                    className={`font-semibold block ${
                      m.completed ? 'text-slate-800' : 'text-slate-400'
                    }`}
                  >
                    {m.title}
                  </span>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {m.location}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {m.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
