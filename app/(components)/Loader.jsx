import React from "react";

const Loader = () => {
  return (
    <div class="loader">
      <figure class="iconLoaderProgress">
        <svg class="iconLoaderProgressFirst" width="240" height="240">
          <circle cx="120" cy="120" r="100"></circle>
        </svg>

        <svg class="iconLoaderProgressSecond" width="240" height="240">
          <circle cx="120" cy="120" r="100"></circle>
        </svg>
      </figure>
    </div>
  );
};

export default Loader;
