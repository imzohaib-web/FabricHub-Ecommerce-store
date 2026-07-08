import React from "react";
import { Search, X } from "lucide-react";

export default function SearchBar({ query, setQuery, placeholder = "Search collection..." }) {
  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full bg-white text-xs border border-brand-sand/50 focus:border-brand-dark focus:outline-none py-3.5 pl-10 pr-10 rounded-sm text-brand-dark transition-colors shadow-sm"
      />
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted">
        <Search size={15} />
      </span>
      {query && (
        <button
          onClick={() => setQuery("")}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-dark transition-colors"
          aria-label="Clear search"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}
