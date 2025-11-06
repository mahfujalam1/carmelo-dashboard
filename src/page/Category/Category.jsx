import React, { useState } from "react";
import { Button, Table, Popconfirm, message } from "antd";
import { useDeleteCategoryMutation, useGetCategoriesQuery } from "../../redux/features/categories/categories";
import AddCategoryModal from "../../component/ui/Modal/category/AddCategoryModal";
import EditCategoryModal from "../../component/ui/Modal/category/EditCategoryModal";
import { Delete, Pen } from "lucide-react";

const CategoryPage = () => {
  const { data } = useGetCategoriesQuery();
  const categories = data?.data || [];
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [deleteCategory, { isLoading: isDeleting }] =useDeleteCategoryMutation();

  const showEditModal = (category) => {
    setEditCategory(category);
    setIsEditModalVisible(true);
  };

  const handleConfirmDelete = async (id) => {
    console.log(id)
    try {
      console.log({ categoryId: { id } });
      const reslut = await deleteCategory({categoryId:{id}}).unwrap();
      console.log("Delete category result:", reslut);
      message.success("Category deleted");
    } catch (err) {
      console.error(err);
      message.error(err?.data?.message || "Failed to delete category");
    }
  };

  return (
    <div>
      <div className="flex justify-end pb-4">
        <button
          className="px-4 py-2 bg-black hover:bg-gray-700 text-white rounded-md"
          onClick={() => setIsAddModalVisible(true)}
        >
          Add Category
        </button>
      </div>
      <Table
        className="w-full"
        style={{ width: "100%" }}
        dataSource={categories}
        columns={[
          {
            title: "S.NO",
            render: (_, __, index) => index + 1, // Render the serial number based on the index
          },
          { title: "Category Name", dataIndex: "name" },
          {
            title: "Category Image",
            dataIndex: "image",
            render: (image) => <img src={image} alt="" style={{ width: 50 }} />,
          },
          {
            title: "Action",
            render: (_, record) => (
              <div className="flex gap-2">
                <Button onClick={() => showEditModal(record)}>
                  <Pen />
                </Button>
                <Popconfirm
                  title="Are you sure?"
                  okText="Yes"
                  cancelText="No"
                  okButtonProps={{ danger: true, loading: isDeleting }}
                  onConfirm={() => handleConfirmDelete(record._id)}
                >
                  <Button danger disabled={isDeleting}>
                    <Delete />
                  </Button>
                </Popconfirm>
              </div>
            ),
          },
        ]}
      />
      <AddCategoryModal
        visible={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
      />
      {isEditModalVisible && (
        <EditCategoryModal
          visible={isEditModalVisible}
          onCancel={() => setIsEditModalVisible(false)}
          category={editCategory}
        />
      )}
    </div>
  );
};

export default CategoryPage;
