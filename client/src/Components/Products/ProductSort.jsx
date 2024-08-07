import React from "react";
import {
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from "react-icons/ai";
import PropTypes from "prop-types";
import { Tooltip } from "antd";

const ProductSort = ({ sort, setSort, fetchProducts }) => {
  const handleSort = (selectedSort) => {
    if (sort === selectedSort) {
      selectedSort = sort === "ASC" ? "DESC" : "ASC";
    }
    setSort(selectedSort);
  };

  return (
    <div>
      {sort === "ASC" ? (
        <button
          onClick={() => handleSort("DESC")}
          className={`p-1 rounded-lg text-lg text-white bg-gray-500 ${
            sort === "DESC" ? "border-blue-500" : ""
          }`}
        >
          <Tooltip title="Products Ascending">
            <AiOutlineSortDescending size={20} />
          </Tooltip>
        </button>
      ) : (
        <button
          onClick={() => handleSort("ASC")}
          className={`p-1 rounded-lg text-lg text-white bg-blue-500 ${
            sort === "ASC" ? "border-blue-500" : ""
          }`}
        >
          <Tooltip title="Products Descending">
            <AiOutlineSortAscending size={20} />
          </Tooltip>
        </button>
      )}
    </div>
  );
};

ProductSort.propTypes = {
  fetchProducts: PropTypes.func.isRequired,
  sort: PropTypes.string.isRequired,
  setSort: PropTypes.func.isRequired,
};

export default ProductSort;
