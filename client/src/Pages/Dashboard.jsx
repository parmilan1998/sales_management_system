import React, { useState } from "react";
import GridLoader from "react-spinners/GridLoader";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center w-full h-[75vh]">
          <GridLoader
            loading={loading}
            size={15}
            aria-label="Loading Spinner"
            data-testid="loader"
            color="#4682B4"
          />
        </div>
      ) : (
        <div className=" max-w-screen-xl mx-auto lg:px-4 font-poppins cursor-pointer">
          <h1 className="text-2xl font-acme text-gray-700 pb-4">Dashboard</h1>
          <div className="grid grid-cols-2 gap-6 w-full">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-slate-50 rounded w-full h-40 p-5 flex flex-col justify-between">
                <h1 className="text-xl text-neutral-400">Categories</h1>
                <span className="text-4xl text-neutral-800 font-medium font-acme">
                  3,786
                </span>
                <h1 className="text-base text-neutral-400">Since last month</h1>
              </div>
              <div className="bg-slate-50 rounded w-full h-40 p-5 flex flex-col justify-between">
                <h1 className="text-xl text-neutral-400">Products</h1>
                <span className="text-4xl text-neutral-800 font-medium font-acme">
                  4,532
                </span>
                <h1 className="text-base text-neutral-400">Since last month</h1>
              </div>
              <div className="bg-slate-50 rounded w-full h-40 p-5 flex flex-col justify-between">
                <h1 className="text-xl text-neutral-400">Sales</h1>
                <span className="text-4xl text-neutral-800 font-medium font-acme">
                  8,452
                </span>
                <h1 className="text-base text-neutral-400">Since last month</h1>
              </div>
              <div className="bg-slate-50 rounded w-full h-40 p-5 flex flex-col justify-between">
                <h1 className="text-xl text-neutral-400">Stocks</h1>
                <span className="text-4xl text-neutral-800 font-medium font-acme">
                  5,536
                </span>
                <h1 className="text-base text-neutral-400">Since last month</h1>
              </div>
            </div>
            <div className="w-full bg-slate-50 rounded"></div>
          </div>
          {/* <div className="grid grid-cols-3 gap-6 py-4">
          <div className="bg-slate-50 rounded w-full h-64 col-span-2"></div>
          <div className="bg-slate-50 rounded w-full h-64 col-span-1"></div>
        </div> */}
        </div>
      )}
    </>
  );
};

export default Dashboard;
