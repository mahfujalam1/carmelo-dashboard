import React, { useState, useEffect } from "react";
import { Modal, Input, Button, Form, message } from "antd";
import { useUpdateCategoryMutation } from "../../../../redux/features/categories/categories";

const EditCategoryModal = ({ visible, onCancel, category }) => {
  const [form] = Form.useForm();
  const [imagePreview, setImagePreview] = useState(category?.image || null);
  const [updateCategory, { isLoading }] = useUpdateCategoryMutation();

  useEffect(() => {
    if (category) {
      form.setFieldsValue({
        categoryName: category.name,
        // NOTE: image field-e default hisebe string URL thakbe
        categoryImage: category.image,
      });
      setImagePreview(category.image || null);
    }
  }, [category, form]);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(url);
    // IMPORTANT: File object form e set korchi
    form.setFieldsValue({ categoryImage: file });
  };

  const handleSubmit = async () => {
    try {
      // only name validate korchi; image optional (old image thakle okey)
      const { categoryName } = await form.validateFields(["categoryName"]);
      const imgVal = form.getFieldValue("categoryImage"); // File or string(URL)

      const fd = new FormData();
      fd.append("name", categoryName.trim());
      if (imgVal instanceof File) {
        fd.append("image", imgVal);
      }

      // 👉 EXACTLY ei shape-e pathacchi: { data, id: _id }
      const payload = { id: category?._id, data: fd };
      console.log("Update payload (RTK):", payload);

      const res = await updateCategory(payload).unwrap();
      console.log("Update category result:", res);
      message.success("Category updated");

      // cleanup
      form.resetFields();
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
      onCancel();
    } catch (err) {
      if (err?.errorFields) return; // antd validation error
      console.error("Update category failed:", err);
      message.error(err?.data?.message || "Failed to update category");
    }
  };

  return (
    <Modal
      title="Edit Category"
      open={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form form={form} layout="vertical">
        <Form.Item label="Category Image">
          <div className="relative flex h-36 w-full items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="preview"
                className="h-24 w-24 rounded-full object-cover ring-1 ring-gray-200"
              />
            ) : (
              <span className="text-sm text-gray-500">Browse Image</span>
            )}
            {/* full-area file input */}
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleFile}
            />
          </div>
        </Form.Item>

        <Form.Item
          label="Category Name"
          name="categoryName"
          rules={[
            { required: true, message: "Please input the category name!" },
          ]}
        >
          <Input placeholder="Food" />
        </Form.Item>

        <Button
          type="primary"
          className="w-full"
          onClick={handleSubmit}
          loading={isLoading}
        >
          Submit
        </Button>
      </Form>
    </Modal>
  );
};

export default EditCategoryModal;
