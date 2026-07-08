import React from "react";

export default function DashboardCard({ title, value, icon: Icon, description, trend }) {
  return (
    <div className="bg-white p-6 border border-brand-sand/15 rounded-sm shadow-sm flex flex-col justify-between text-left">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-muted">
            {title}
          </span>
          <p className="text-2xl font-serif font-light text-brand-dark">
            {value}
          </p>
        </div>
        <div className="p-3 bg-brand-champagne/50 rounded-sm text-brand-gold">
          <Icon size={20} />
        </div>
      </div>
      {(description || trend) && (
        <div className="mt-4 pt-3 border-t border-brand-champagne/40 flex items-center justify-between text-[10px] uppercase font-bold tracking-wider">
          <span className="text-brand-muted">{description}</span>
          {trend && (
            <span className={trend.startsWith("+") ? "text-green-600" : "text-red-500"}>
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
