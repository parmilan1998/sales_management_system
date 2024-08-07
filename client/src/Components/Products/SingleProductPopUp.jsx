/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import PropTypes from "prop-types";
const apiUrl = import.meta.env.VITE_API_BASE_URL;

const SingleProductPopUp = ({ rowData }) => {
  const baseUrl = `${apiUrl}/public/products`;

  return (
    <div>
      <div className="overflow-hidden rounded bg-gray-200 text-slate-500 shadow-none shadow-slate-200 font-poppins">
        <figure>
          <img
            src={`${baseUrl}/${rowData.imageUrl}`}
            alt="card image"
            className="aspect-video w-full h-48 bg-cover object-fill"
          />
        </figure>
        <div className="p-4">
          <header className="mb-4 space-y-2">
            <h3 className="text-xl font-medium text-slate-700">
              {rowData.productName}
            </h3>
            <div className="flex justify-between items-center">
              <p className="text-base text-slate-500">
                Price: Rs.{rowData.unitPrice}
              </p>
              <div>
                {" "}
                <p className="text-base text-slate-500">
                  Stock: {rowData.totalQuantity}&nbsp;
                  {rowData.unitType}
                </p>
                <p className="text-base text-slate-500">
                  Reorder Level: {rowData.reOrderLevel}&nbsp;
                  {rowData.unitType}
                </p>
              </div>
            </div>
            <p className="text-base text-slate-500">
              Category: {rowData.categoryName}
            </p>
          </header>
          <p className="text-md">Description: {rowData.productDescription}</p>
        </div>
      </div>
    </div>
  );
};

SingleProductPopUp.propTypes = {
  rowData: PropTypes.object.isRequired,
};

export default SingleProductPopUp;
