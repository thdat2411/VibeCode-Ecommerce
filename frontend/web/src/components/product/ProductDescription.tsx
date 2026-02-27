"use client";

import React from "react";

interface ProductDescriptionProps {
  shortDescription?: string;
  longDescription?: string;
  sku?: string;
  specifications?: string[];
}

export function ProductDescription({
  shortDescription,
  longDescription,
  sku,
  specifications,
}: ProductDescriptionProps) {
  return (
    <div className="pt-4 space-y-6">
      {sku && (
        <div>
          <p className="text-sm text-gray-600">
            SKU: <span className="font-semibold text-gray-900">{sku}</span>
          </p>
        </div>
      )}

      {shortDescription && (
        <div>
          <h3 className="font-semibold mb-3">Product Details</h3>
          <p className="text-gray-700 text-sm leading-relaxed">
            {shortDescription}
          </p>
        </div>
      )}

      {longDescription && (
        <div>
          <h3 className="mb-3">Description</h3>
          <div className="text-gray-700 text-sm leading-relaxed prose prose-sm max-w-none">
            {longDescription.split("\n").map((paragraph, index) => (
              <p key={index} className="mb-3">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      )}

      {specifications && specifications.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">Specifications</h3>
          <ul className="space-y-2">
            {specifications.map((spec, index) => (
              <li
                key={index}
                className="text-gray-700 text-sm flex items-start gap-2"
              >
                <span className="text-gray-400 mt-1">•</span>
                <span>{spec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
