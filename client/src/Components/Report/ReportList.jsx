import React, { useState, useRef, useEffect } from "react";
import reportsApi from "../../api/reports";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import ReportSort from "./ReportSort";
import ReportSearch from "./ReportSearch";

const ReportList = ({
  report,
  limit,
  page,
  sort,
  setSort,
  search,
  setSearch,
  setPage,
}) => {
  const handleFileView = async (reportID) => {
    try {
      const response = await reportsApi.get(`/download/${reportID}`, {
        responseType: "blob", // Ensure responseType is 'blob' to handle binary data
      });

      // Create a blob from the response data
      const blob = new Blob([response.data], { type: "application/pdf" });

      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Open the PDF in a new tab
      window.open(url, "_blank");

      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 30000);
    } catch (error) {
      console.error("Error viewing file:", error);
      toast.error("Failed to view file");
    }
  };

  return (
    <div className=" font-poppins mr-8">
      <div className="mx-4 my-3 flex lg:flex-row md:flex-row flex-col  items-center gap-2">
        <div className="flex justify-start ">
          <h1 className="text-3xl font-semibold font-acme text-blue-700">
            ReportList
          </h1>
        </div>
        <div className="flex flex-row items-center gap-2 justify-end">
          <div className="lg:ml-0 md:ml-0 ml-16 mt-2 font-poppins ">
            <h2>sortBy:</h2>
          </div>
          <div className="mr-2">
            <ReportSort sort={sort} setSort={setSort} />
          </div>
          <div className=" ml-auto ">
            <ReportSearch
              search={search}
              setSearch={setSearch}
              setPage={setPage}
            />
          </div>
        </div>
      </div>
      <div className="w-full pr-6 mr-8 lg:pr-0 lg:ml-6 md:pr-0 md:ml-6">
        <table className="w-full text-left border border-separate rounded border-slate-400 ">
          <tbody>
            <tr>
              <th
                scope="col"
                className="hidden h-12 px-6 text-sm font-medium border-l sm:table-cell first:border-l-0 border-slate-400  stroke-slate-700 text-black bg-slate-100"
              >
                No
              </th>
              <th
                scope="col"
                className="hidden h-12 px-6 text-sm font-medium border-l sm:table-cell first:border-l-0 border-slate-400 stroke-slate-700 text-black bg-slate-100"
              >
                Report Name
              </th>
              <th
                scope="col"
                className="hidden h-12 px-6 text-sm font-medium border-l sm:table-cell first:border-l-0 border-slate-400 stroke-slate-700 text-black bg-slate-100"
              >
                Start Date
              </th>
              <th
                scope="col"
                className="hidden h-12 px-6 text-sm font-medium border-l sm:table-cell first:border-l-0 border-slate-400 stroke-slate-700 text-black bg-slate-100"
              >
                End Date
              </th>
              <th
                scope="col"
                className="hidden h-12 px-6 text-sm font-medium border-l sm:table-cell first:border-l-0 border-slate-400 stroke-slate-700 text-black bg-slate-100  w-6"
              >
                Report
              </th>
            </tr>
            {report.length > 0 ? (
              report.map((item, index) => (
                <tr
                  className="block border-b sm:table-row last:border-b-0 border-slate-400 sm:border-none"
                  key={index}
                >
                  <td
                    data-th="Name"
                    className="before:w-24 before:inline-block before:font-medium before:text-slate-200 before:content-[attr(data-th)':'] sm:before:content-none flex items-center sm:table-cell h-12 px-6 text-sm transition duration-300 sm:border-t sm:border-l first:border-l-0 border-slate-400 stroke-slate-500 text-black"
                  >
                    {(page - 1) * limit + (index + 1)}
                  </td>
                  <td
                    data-th="Title"
                    className="before:w-24 before:inline-block before:font-medium before:text-slate-700 before:content-[attr(data-th)':'] sm:before:content-none flex items-center sm:table-cell h-12 px-6 text-sm transition duration-300 sm:border-t sm:border-l first:border-l-0 border-slate-400 stroke-slate-500 text-black"
                  >
                    {item.reportName}
                  </td>
                  <td
                    data-th="Company"
                    className="before:w-24 before:inline-block before:font-medium before:text-slate-700 before:content-[attr(data-th)':'] sm:before:content-none flex items-center sm:table-cell h-12 px-6 text-sm transition duration-300 sm:border-t sm:border-l first:border-l-0 border-slate-400 stroke-slate-500 text-black"
                  >
                    {item.startDate}
                  </td>
                  <td
                    data-th="Company"
                    className="before:w-24 before:inline-block before:font-medium before:text-slate-700 before:content-[attr(data-th)':'] sm:before:content-none flex items-center sm:table-cell h-12 px-6 text-sm transition duration-300 sm:border-t sm:border-l first:border-l-0 border-slate-400 stroke-slate-500 text-black"
                  >
                    {item.endDate}
                  </td>
                  <td
                    data-th="Role"
                    className="before:w-24 before:inline-block before:font-medium before:text-slate-700 before:content-[attr(data-th)':'] sm:before:content-none flex items-center sm:table-cell h-12 px-6 text-sm transition duration-300 sm:border-t sm:border-l first:border-l-0 border-slate-400 stroke-slate-500 text-blue-600 hover:text-blue-800"
                  >
                    <button onClick={() => handleFileView(item.reportID)}>
                      {item.reportFile}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  No reports found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

ReportList.propTypes = {
  report: PropTypes.array,
  limit: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  sort: PropTypes.string.isRequired,
  setSort: PropTypes.func.isRequired,
  search: PropTypes.string.isRequired,
  setPage: PropTypes.func.isRequired,
  setSearch: PropTypes.func.isRequired,
};

export default ReportList;
