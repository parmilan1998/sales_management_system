import React, { useEffect } from "react";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import categoryApi from "../../api/category";
import { Popconfirm, Tooltip } from "antd";

const CategoryList = ({
  category,
  setCategory,
  fetchCategories,
  openEditPopup,
  baseUrl,
}) => {
  useEffect(() => {
    setCategory(category);
  }, [category, setCategory]);

  // console.log(category);

  // Delete category
  const handleDelete = async (id) => {
    try {
      await categoryApi.delete(`/${id}`);
      toast.success("Category deleted Successfully!", { duration: 2000 });
      fetchCategories();
    } catch (err) {
      toast.error(
        "Can't delete this category since it is linked with other records!!"
      );
      console.log(err);
    }
  };

  return (
    <div className="w-full  cursor-pointer z-10">
      <div className="flex flex-wrap  -mx-2">
        {category.map((item, index) => (
          <div
            key={index}
            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2 mb-4"
          >
            <article className="relative overflow-hidden rounded-lg shadow transition hover:shadow-lg h-auto flex flex-col justify-between">
              <Link to={`/category/fbc/${item.categoryID}`}>
                <img
                  src={`${baseUrl}/${item.imageUrl}`}
                  alt={item.categoryName}
                  className="w-full h-32 object-cover"
                />
              </Link>
              <div className="flex-grow bg-gradient-to-t from-gray-900/50 to-gray-900/25 p-4 sm:p-6">
                <Link href="#">
                  <h3 className="mt-0.5 text-lg text-white">
                    {item.categoryName}
                  </h3>
                </Link>
                <p className="mt-2 line-clamp-3 h-24 text-sm/relaxed text-white/95">
                  {item.categoryDescription}
                </p>
              </div>

              <div className="flex justify-between z-20 gap-3 ml-2 mr-2 p-3">
                <button onClick={() => openEditPopup(item)}>
                  <Tooltip title="Edit Category">
                    <FaRegEdit size={20} color="green" />
                  </Tooltip>
                </button>
                <Popconfirm
                  title="Delete the task"
                  description="Are you sure to delete this task?"
                  okText="Yes"
                  cancelText="No"
                  onConfirm={() => {
                    handleDelete(item.categoryID);
                  }}
                >
                  <button>
                    <Tooltip title="Delete Category">
                      <MdDelete size={20} color="red" />
                    </Tooltip>
                  </button>
                </Popconfirm>
              </div>
            </article>
          </div>
        ))}
      </div>
    </div>
  );
};

CategoryList.propTypes = {
  category: PropTypes.array.isRequired,
  setCategory: PropTypes.func.isRequired,
  openEditPopup: PropTypes.func.isRequired,
  fetchCategories: PropTypes.func.isRequired,
  baseUrl: PropTypes.string.isRequired,
};

export default CategoryList;
