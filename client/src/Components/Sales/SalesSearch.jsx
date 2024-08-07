import React from "react";
import PropTypes from "prop-types";

const SalesSearch = ({ search, setSearch, setPage }) => {
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div>
      <div className="relative my-6">
        <input
          id="id-s03"
          type="search"
          value={search}
          onChange={handleSearch}
          name="id-s03"
          placeholder="Search here"
          aria-label="Search content"
          className="peer relative h-9 w-full rounded border border-slate-200 px-4 pr-12 text-sm text-gray-500 outline-none transition-all autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-cyan-500 focus:outline-none invalid:focus:border-pink-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute right-4 top-2.5 h-4.5 w-5 cursor-pointer stroke-slate-400 peer-disabled:cursor-not-allowed"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
          aria-label="Search icon"
          role="graphics-symbol"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </div>
    </div>
  );
};

SalesSearch.propTypes = {
  search: PropTypes.string.isRequired,
  setPage: PropTypes.func.isRequired,
  setSearch: PropTypes.func.isRequired,
};

export default SalesSearch;
