import React from "react";

const Loader = () => {
  return (
    <div className="loader-wrapper" style={{ minHeight: "260px" }}>
      <div className="loader" role="status" aria-label="Loading..."></div>
    </div>
  );
};

export default Loader;
