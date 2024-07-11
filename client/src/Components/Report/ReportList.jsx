import React, { useState, useRef, useEffect } from "react";
import reportsApi from "../../api/reports";
import { Popconfirm } from "antd";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import ReportSort from "./ReportSort";
import ReportSearch from "./ReportSearch";
import { useForm } from "react-hook-form";
import CreateReport from "./CreateReport";
import { FcDownload } from "react-icons/fc";

const ReportList = ({
  fetchReports,
  report,
  limit,
  page,
  sort,
  setSort,
  search,
  setSearch,
  setPage,
}) => {
  const popupRef = useRef();
  const [isOpen, setIsOpen] = useState(true);
  const [isUpdate, setIsUpdate] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
  } = useForm();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsOpen(true);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [popupRef]);

  const openEditPopup = (report) => {
    setSelectedReport(report);
    setIsUpdate(true);
    setIsOpen(false);
  };
  const closePopup = () => {
    setIsOpen(true);
    setSelectedReport(null);
    reset();
  };

  // Reset input fields

  const handleDelete = async (id) => {
    try {
      await reportsApi.delete(`/${id}`);
      toast.success("Report deleted Successfully!", { duration: 2000 });
      fetchReports();
    } catch (err) {
      toast.error(
        "Can't delete this Report since it is linked with other records!!"
      );
      console.log(err);
    }
  };

  const handleFileDownload = async (reportID) => {
    try {
      const response = await reportsApi.get(`/download/${reportID}`, {
        responseType: "blob", // Ensure responseType is 'blob' to handle binary data
      });

      // Create a blob from the response data
      const blob = new Blob([response.data], { type: "application/pdf" });

      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a link element and click it to trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Gross_Profit_Report_${reportID}.pdf`);
      document.body.appendChild(link);
      link.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to download file");
    }
  };

  return (
    <div>
      <div className="mx-4 my-3 flex flex-row gap-2">
        <div>
          <h1 className="text-3xl font-semibold font-acme text-blue-700">
            ReportList
          </h1>
        </div>
        <div className="ml-2 mt-2 font-poppins ">
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
      <div className="w-full mx-3 px-2">
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
                className="hidden h-12 px-6 text-sm font-medium border-l sm:table-cell first:border-l-0 border-slate-400 stroke-slate-700 text-black bg-slate-100"
              >
                Report
              </th>
              <th
                scope="col"
                className="hidden h-12 px-6 text-sm font-medium border-l sm:table-cell first:border-l-0 border-slate-400 stroke-slate-700 text-black bg-slate-100"
              >
                Actions
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
                    <button onClick={() => handleFileDownload(item.reportID)}>
                      {item.reportFile}
                    </button>
                  </td>
                  <td
                    data-th="Username"
                    className="before:w-24 before:inline-block before:font-medium before:text-slate-700 before:content-[attr(data-th)':'] sm:before:content-none flex items-center sm:table-cell h-12 px-6 text-sm transition duration-300 sm:border-t sm:border-l first:border-l-0 border-slate-400 stroke-slate-500 text-slate-500"
                  >
                    <div>
                      <button
                        className=" mr-3"
                        onClick={() => openEditPopup(item)}
                      >
                        <FaRegEdit size={20} color="green" />
                      </button>
                
                      <button onClick={() => handleFileDownload(item.reportID)}>
                      <FcDownload size={20} />
                      </button>

                      <Popconfirm
                        title="Delete the task"
                        description="Are you sure to delete this task?"
                        okText="Yes"
                        cancelText="No"
                        onConfirm={() => {
                          handleDelete(item.reportID);
                        }}
                      >
                        <button className=" ml-3">
                          <MdDelete size={20} color="red" />
                        </button>
                      </Popconfirm>
                    </div>
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
      {!isOpen && (
        <div className="fixed  inset-0 mx-auto flex items-center justify-center max-h-svh z-50 overflow-y-auto">
          <div
            ref={popupRef}
            className="rounded-2xl absolute z-50 border border-blue-100 bg-white p-4 shadow-lg sm:p-6 lg:p-8  w-full md:w-[80%] max-w-[850px]"
            role="alert"
          >
            <div className="flex items-center justify-center gap-4 py-6 font-poppins">
              <span className="shrink-0 rounded-full bg-blue-400 p-2 text-white">
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z"
                    fillRule="evenodd"
                  />
                </svg>
              </span>
              <p className="font-semibold sm:text-2xl text-gray-700">
                Update Category
              </p>
            </div>
            <div>
              <CreateReport
                isUpdate={true}
                selectedReport={selectedReport}
                fetchReports={fetchReports}
                closePopup={closePopup}
              />
            </div>

            <div className="mt-3 sm:flex sm:gap-4 flex justify-center ">
              <button
                onClick={closePopup}
                className="mt-2 cursor-pointer inline-block w-full rounded-lg bg-gray-100 px-5 py-3 text-center text-sm font-semibold text-gray-500 sm:mt-0 sm:w-auto border border-slate-400"
                href="#"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

ReportList.propTypes = {
  fetchReports: PropTypes.func.isRequired,
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
