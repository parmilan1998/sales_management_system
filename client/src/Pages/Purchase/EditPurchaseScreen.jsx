/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_BASE_URL;

const EditPurchaseScreen = () => {
  const [products, setProducts] = useState([]);

  const navigate = useNavigate();
  const { id } = useParams();

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
  } = useForm();

  const handleClear = () => {
    reset();
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/v1/product/list`);
      setProducts(res.data);
    } catch (err) {
      console.error(err.message);
    }
  };

  const fetchUpdatePurchaseDetails = async () => {
    console.log("yyyy", id);
    try {
      const res = await axios.get(`${apiUrl}/api/v1/purchase/${id}`);
      const purchase = res.data;
      console.log("Purchase: " + res.data);
      setValue("productName", purchase.productName);
      setValue("purchaseVendor", purchase.purchaseVendor);
      setValue("vendorContact", purchase.vendorContact);
      setValue("purchaseQuantity", purchase.purchaseQuantity);
      setValue("purchasePrice", purchase.purchasePrice);
      setValue("manufacturedDate", purchase.manufacturedDate);
      setValue("expiryDate", purchase.expiryDate);
      setValue("purchasedDate", purchase.purchasedDate);
    } catch (err) {
      console.error(err.message);
    }
  };

  const onSubmit = async (data) => {
    try {
      const res = await axios.put(`${apiUrl}/api/v1/purchase/${id}`, data);
      toast.success(`Purchase updated successfully!`);
      navigate("/purchase");
      reset();
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchUpdatePurchaseDetails();
  }, [id]);

  return (
    <div className="max-w-screen-xl mx-auto lg:px-24 font-poppins cursor-pointer">
      <div className="bg-white rounded p-10">
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
            Edit Purchase!
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-2">
            <div className="mb-4">
              <label
                htmlFor="purchaseVendor"
                className="flex pb-2 text-gray-600"
              >
                Purchase Vendor
              </label>
              <input
                {...register("purchaseVendor", {
                  required: "purchaseVendor is required",
                })}
                type="text"
                name="purchaseVendor"
                id="purchaseVendor"
                className="w-full py-3 px-3 rounded border border-gray-300 mx-auto text-sm focus:outline-cyan-400"
                placeholder="Ex - John Wick"
              />
              {errors.purchaseVendor && (
                <p className="text-red-500 py-1 text-sm">
                  {errors.purchaseVendor.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="vendorContact"
                className="flex pb-2 text-gray-600"
              >
                Vendor Contact
              </label>
              <input
                {...register("vendorContact", {
                  required: "vendorContact is required",
                })}
                type="text"
                name="vendorContact"
                id="vendorContact"
                className="w-full py-2.5 px-3 rounded border border-gray-300 mx-auto text-sm focus:outline-cyan-400"
                placeholder="Ex - 0771234563"
              />
              {errors.vendorContact && (
                <p className="text-red-500 py-1 text-sm">
                  {errors.vendorContact.message}
                </p>
              )}
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="productName" className="flex pb-2 text-gray-600">
              Product Name
            </label>
            <select
              {...register("productName", {
                required: "productName is required",
              })}
              name="productName"
              id="productName"
              className="w-full py-2.5 px-3 rounded border border-gray-300 mx-auto text-sm focus:outline-cyan-400"
            >
              <option value="" className="text-gray-200 opacity-5">
                Ex - Home Essentials
              </option>
              {products.map((product, index) => (
                <option value={product.productName} key={index}>
                  {product.productName}
                </option>
              ))}
            </select>
            {errors.productName && (
              <p className="text-red-500 py-1 text-sm">
                {errors.productName.message}
              </p>
            )}
          </div>
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-2">
            <div className="mb-4">
              <label
                htmlFor="purchaseQuantity"
                className="flex pb-2 text-gray-600"
              >
                Purchase Quantity
              </label>
              <input
                {...register("purchaseQuantity", {
                  required: "purchaseQuantity is required",
                })}
                type="number"
                name="purchaseQuantity"
                id="purchaseQuantity"
                className="w-full py-3 px-3 rounded border border-gray-300 mx-auto text-sm focus:outline-cyan-400"
                placeholder="Ex - 34"
              />
              {errors.purchaseQuantity && (
                <p className="text-red-500 py-1 text-sm">
                  {errors.purchaseQuantity.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="purchasePrice"
                className="flex pb-2 text-gray-600"
              >
                Purchase Price
              </label>
              <input
                {...register("purchasePrice", {
                  required: "purchasePrice is required",
                })}
                type="text"
                name="purchasePrice"
                id="purchasePrice"
                className="w-full py-3 px-3 rounded border border-gray-300 mx-auto text-sm focus:outline-cyan-400"
                placeholder="Ex - Rs.59.99"
              />
              {errors.purchasePrice && (
                <p className="text-red-500 py-1 text-sm">
                  {errors.purchasePrice.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid lg:grid-cols-3 grid-cols-1 gap-2">
            <div className="mb-4">
              <label
                htmlFor="manufacturedDate"
                className="flex pb-2 text-gray-600"
              >
                Manufactured Date
              </label>
              <input
                {...register("manufacturedDate", {
                  required: "manufacturedDate is required",
                })}
                type="date"
                name="manufacturedDate"
                id="manufacturedDate"
                className="w-full py-3 px-3 rounded border border-gray-300 mx-auto text-sm focus:outline-cyan-400"
              />
              {errors.manufacturedDate && (
                <p className="text-red-500 py-1 text-sm">
                  {errors.manufacturedDate.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="expiryDate" className="flex pb-2 text-gray-600">
                Expiry Date
              </label>
              <input
                {...register("expiryDate", {
                  required: "expiryDate is required",
                })}
                type="date"
                name="expiryDate"
                id="expiryDate"
                className="w-full py-3 px-3 rounded border border-gray-300 mx-auto text-sm focus:outline-cyan-400"
              />
              {errors.expiryDate && (
                <p className="text-red-500 py-1 text-sm">
                  {errors.expiryDate.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="purchasedDate"
                className="flex pb-2 text-gray-600"
              >
                Purchased Date
              </label>
              <input
                {...register("purchasedDate", {
                  required: "purchasedDate is required",
                })}
                type="date"
                name="purchasedDate"
                id="purchasedDate"
                className="w-full cursor-pointer py-3 px-3 rounded border border-gray-300 mx-auto text-sm focus:outline-cyan-400"
              />
              {errors.purchasedDate && (
                <p className="text-red-500 py-1 text-sm">
                  {errors.purchasedDate.message}
                </p>
              )}
            </div>
          </div>
          <div className="mt-6 sm:flex sm:gap-4 flex justify-center">
            <Link to="/purchase">
              <button className="mt-2 cursor-pointer inline-block w-full rounded-lg bg-gray-500 px-5 py-3 text-center text-sm font-semibold text-white sm:mt-0 sm:w-auto">
                Cancel
              </button>
            </Link>
            <button
              onClick={handleClear}
              className="mt-2 cursor-pointer inline-block w-full rounded-lg bg-blue-500 px-5 py-3 text-center text-sm font-semibold text-white sm:mt-0 sm:w-auto"
            >
              Clear
            </button>
            <button
              type="submit"
              className="inline-block w-full cursor-pointer rounded-lg bg-green-500 px-5 py-3 text-center text-sm font-semibold text-white sm:w-auto"
            >
              Update Purchase
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPurchaseScreen;
