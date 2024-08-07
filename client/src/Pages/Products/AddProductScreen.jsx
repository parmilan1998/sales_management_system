import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { IoMdAddCircleOutline } from "react-icons/io";
const apiUrl = import.meta.env.VITE_API_BASE_URL;

const AddProduct = () => {
  const [category, setCategory] = useState([]);
  const [unit, setUnit] = useState([]);
  const [unitType, setUnitType] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddUnitType = async () => {
    try {
      const res = await axios.post(`${apiUrl}/api/v1/unit`, {
        unitType,
      });
      console.log(res.data);
      toast.success("Unit added successfully!");
      setUnitType("");
      setIsAdding(false);
      fetchUnitApi();
    } catch (err) {
      console.log(err.message);
      toast.error("Failed to add unit type");
    }
  };
  const handleIconClick = () => {
    setIsAdding(!isAdding);
  };

  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  // Created products
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("productName", data.productName);
      formData.append("image", data.image[0]);
      formData.append("categoryName", data.categoryName);
      formData.append("unitType", data.unitType);
      formData.append("unitPrice", data.unitPrice);
      formData.append("discount", data.discount);
      formData.append("reOrderLevel", data.reOrderLevel);
      formData.append("productDescription", data.description);

      const response = await axios.post(`${apiUrl}/api/v1/product`, formData);

      console.log(response.data);
      toast.success(`Product created successfully!`);
      navigate("/products");
      reset();
    } catch (error) {
      console.error("Failed to create product:", error);
      toast.error(`Failed to create product: ${error.message}`);
    }
  };

  // Reset input fields
  const handleClear = () => {
    reset();
  };

  // Fetch categories
  const fetchCategoryApi = async () => {
    const res = await axios
      .get(`${apiUrl}/api/v1/category/list`)
      .then((res) => {
        console.log(res.data);
        setCategory(res.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const fetchUnitApi = async () => {
    const res = await axios
      .get(`${apiUrl}/api/v1/unit/list`)
      .then((res) => {
        console.log(res.data);
        setUnit(res.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    fetchCategoryApi();
    fetchUnitApi();
  }, []);

  return (
    <div className=" max-w-screen-2xl mx-auto lg:px-8 font-poppins cursor-pointer">
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
            Add New Product!
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-2">
            <div className="mb-4">
              <label htmlFor="productName" className="flex pb-2 text-gray-600">
                ProductName
              </label>
              <input
                {...register("productName", {
                  required: "ProductName is required",
                })}
                type="text"
                name="productName"
                id="productName"
                className="w-full py-2 px-3 rounded border border-gray-300 mx-auto text-sm focus:outline-cyan-400"
                placeholder="Ex - Memory Foam Pillow"
              />
              {errors.productName && (
                <p className="text-red-500 py-1 text-sm">
                  {errors.productName.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="categoryName" className="flex pb-2 text-gray-600">
                Category Name
              </label>
              <select
                {...register("categoryName", {
                  required: "Category Name is required",
                })}
                type="text"
                name="categoryName"
                id="categoryName"
                className="w-full py-2 px-3 rounded border border-gray-300 mx-auto text-sm focus:outline-cyan-400"
                placeholder="Ex - Home Essentials"
              >
                <option value="" className="text-gray-200 opacity-5">
                  Ex - Home Essentials
                </option>
                {category.map((category, index) => (
                  <option value={category.categoryName} key={index}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
              {errors.categoryName && (
                <p className="text-red-500 py-1 text-sm">
                  {errors.categoryName.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 grid-cols-1 gap-2">
            {/* <div className="mb-4 col-span-2">
              <label htmlFor="image" className="flex pb-2 text-gray-600">
                Product Image
              </label>
              <input
                {...register("image", {
                  required: "Image is required",
                })}
                type="file"
                name="image"
                id="image"
                className="w-full py-2 px-3 rounded border border-gray-300 mx-auto text-sm focus:outline-cyan-400"
                placeholder="Ex - Rs.59.99"
              />
              {errors.image && (
                <p className="text-red-500 py-1 text-sm">
                  {errors.image.message}
                </p>
              )}
            </div> */}
            <div className="my-4 col-span-2">
              <label htmlFor="image" className="flex pb-2 text-gray-600">
                Product Image
              </label>
              <input
                {...register("image", {
                  required: "Image is required",
                })}
                type="file"
                name="image"
                id="image"
                className="w-full py-1.5 px-3 rounded border border-gray-300 mx-auto text-sm focus:outline-cyan-400"
                placeholder="Ex - Rs.59.99"
              />
              {errors.image && (
                <p className="text-red-500 py-1 text-sm">
                  {errors.image.message}
                </p>
              )}
            </div>
            <div className="my-4 col-span-1">
              <label htmlFor="reOrderLevel" className="flex pb-2 text-gray-600">
                Reorder Level
              </label>
              <input
                {...register("reOrderLevel", {
                  required: "reorder level is required",
                })}
                type="number"
                name="reOrderLevel"
                id="reOrderLevel"
                className="w-full py-2 px-3 rounded border border-gray-300 mx-auto text-sm focus:outline-cyan-400"
                placeholder="Ex - 40"
              />
              {errors.reOrderLevel && (
                <p className="text-red-500 py-1 text-sm">
                  {errors.reOrderLevel.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 grid-cols-1 gap-2">
            <div className="mb-4">
              <div className="flex flex-row gap-3">
                <label
                  htmlFor="unitType"
                  className="flex pb-2 text-gray-600 my-2"
                >
                  Unit Type
                </label>
                <div className=" my-1.5">
                  <button
                    type="button"
                    onClick={handleIconClick}
                    className="py-1 px-1 rounded bg-blue-500 text-white text-sm focus:outline-none"
                  >
                    <IoMdAddCircleOutline size={20} />
                  </button>
                </div>
              </div>
              {isAdding ? (
                <div className="mb-2">
                  <input
                    type="text"
                    value={unitType}
                    onChange={(e) => setUnitType(e.target.value)}
                    placeholder="Add new unit type"
                    className="w-full py-2 px-3 mb-2 rounded border border-gray-300 text-sm focus:outline-cyan-400"
                  />
                  <button
                    type="button"
                    onClick={handleAddUnitType}
                    className="py-1.5 px-3 rounded bg-blue-500 text-white text-sm focus:outline-none"
                  >
                    Add
                  </button>
                </div>
              ) : (
                <select
                  {...register("unitType", {
                    required: "UnitType is required",
                  })}
                  type="text"
                  name="unitType"
                  id="unitType"
                  className="w-full py-2 px-3 rounded border border-gray-300 mx-auto text-sm focus:outline-cyan-400"
                >
                  <option value="" className="text-gray-200 opacity-5">
                    Ex - Pair
                  </option>
                  {unit.map((unit, index) => (
                    <option value={unit.unitType} key={index}>
                      {unit.unitType}
                    </option>
                  ))}
                </select>
              )}
              {errors.unitType && (
                <p className="text-red-500 py-1 text-sm">
                  {errors.unitType.message}
                </p>
              )}
            </div>
            <div className="my-4">
              <label htmlFor="unitPrice" className="flex pb-2 text-gray-600">
                Unit Price
              </label>
              <input
                {...register("unitPrice", {
                  required: "Unit price is required",
                })}
                type="text"
                name="unitPrice"
                id="unitPrice"
                className="w-full py-2 px-3 rounded border border-gray-300 mx-auto text-sm focus:outline-cyan-400"
                placeholder="Ex - Rs.59.99"
              />
              {errors.unitPrice && (
                <p className="text-red-500 py-1 text-sm">
                  {errors.unitPrice.message}
                </p>
              )}
            </div>
            <div className="my-4">
              <label htmlFor="discount" className="flex pb-2 text-gray-600">
                Discount
              </label>
              <input
                {...register("discount", {
                  required: "discount is required",
                })}
                type="number"
                name="discount"
                id="discount"
                defaultValue="0"
                min="0"
                className="w-full py-2 px-3 rounded border border-gray-300 mx-auto text-sm focus:outline-cyan-400"
                placeholder="Ex - 20%"
              />
              {errors.discount && (
                <p className="text-red-500 py-1 text-sm">
                  {errors.discount.message}
                </p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="flex pb-2 text-gray-600">
              Description
            </label>
            <textarea
              {...register("description", {
                required: "Description is required",
              })}
              type="text"
              name="description"
              id="description"
              rows={5}
              className="w-full py-2 px-3 rounded border border-gray-300 mx-auto text-sm focus:outline-cyan-400"
              placeholder="Ex - Ergonomically designed pillow for superior neck support and comfort."
            />
            {errors.description && (
              <p className="text-red-500 py-1 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="mt-6 grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-1 sm:flex gap-2 sm:gap-4 justify-center">
            <Link to="/products">
              <button
                className="mt-2 cursor-pointer inline-block w-full rounded bg-gray-500 px-12 py-2 text-center text-sm font-semibold text-white sm:mt-0 sm:w-auto"
                href="#"
              >
                Cancel
              </button>
            </Link>
            <button
              onClick={handleClear}
              className="mt-2 cursor-pointer inline-block w-full rounded bg-blue-500 px-12 py-2 text-center text-sm font-semibold text-white sm:mt-0 sm:w-auto"
              href="#"
            >
              Clear
            </button>
            <button
              type="submit"
              className="inline-block w-full cursor-pointer rounded bg-green-500 px-12 py-2 text-center text-sm font-semibold text-white sm:w-auto"
              href="#"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
