import React from "react";
import PropTypes from "prop-types";

export default function EndpointMenu({ selectedEndpoint, onEndpointChange }) {
  const endpoints = [
    "ownData-Fusion",
    "ownData-CLIP",
    "orgData-Fusion",
    "orgData-CLIP"
  ];

  return (
    <select
      value={selectedEndpoint}
      onChange={(e) => onEndpointChange(e.target.value)}
      className="text-sm p-1 border rounded"
    >
      {endpoints.map((endpoint) => (
        <option key={endpoint} value={endpoint}>
          {endpoint}
        </option>
      ))}
    </select>
  );
};

EndpointMenu.propTypes = {
  selectedEndpoint: PropTypes.string.isRequired,
  onEndpointChange: PropTypes.func.isRequired,
};