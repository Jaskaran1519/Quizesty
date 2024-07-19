import React from "react";

const Loader = () => {
  return (
    <div className="loader">
      <figure className="iconLoaderProgress">
        <svg className="iconLoaderProgressFirst" width="240" height="240">
          <circle cx="120" cy="120" r="100"></circle>
        </svg>

        <svg className="iconLoaderProgressSecond" width="240" height="240">
          <circle cx="120" cy="120" r="100"></circle>
        </svg>
      </figure>
    </div>
  );
};

export default Loader;
