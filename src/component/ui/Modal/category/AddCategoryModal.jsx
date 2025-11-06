import React, { useState, useEffect } from "react";
import { Modal, Input, Button, Form, message } from "antd";
import { useCreateCategoryMutation } from "../../../../redux/features/categories/categories";

const AddCategoryModal = ({ visible, onCancel }) => {
  const [form] = Form.useForm();
  const [preview, setPreview] = useState(null);
  const [createCategory, { isLoading }] = useCreateCategoryMutation();

  // cleanup preview URL
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleSubmit = async () => {
    try {
      // AntD-ke validate korte dao; eita form store theke thik value tulbe
      const { categoryName, categoryImage } = await form.validateFields();

      const fd = new FormData();
      fd.append("name", categoryName.trim());
      fd.append("image", categoryImage); // eta ekhon File object hobe

      console.log("Submitting payload:", {
        name: categoryName,
        image: categoryImage,
      });

      const res = await createCategory(fd).unwrap();
      console.log("Create category result:", res);
      message.success("Category created");
      form.resetFields();
      setPreview(null);
      onCancel();
    } catch (err) {
      if (err?.errorFields) {
        // validation errors
        return;
      }
      console.error("Create category failed:", err);
      message.error(err?.data?.message || "Failed to create category");
    }
  };

  return (
    <Modal
      title="Add Category"
      open={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form form={form} layout="vertical">
        {/* Category Image (wrapper) */}
        <Form.Item label="Category Image" required>
          <div className="relative flex h-36 w-full items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
            {preview ? (
              <img
                src={preview}
                alt="preview"
                className="h-24 w-24 rounded-full object-cover ring-1 ring-gray-200"
              />
            ) : (
              <span className="text-sm text-gray-500">Browse Image</span>
            )}

            {/* Real input must be a DIRECT child of a Form.Item with name */}
            <Form.Item
              name="categoryImage"
              valuePropName="file" // not strictly required, but self-documenting
              getValueFromEvent={(e) => {
                const file = e?.target?.files?.[0] || null;
                if (file) {
                  const url = URL.createObjectURL(file);
                  if (preview) URL.revokeObjectURL(preview);
                  setPreview(url);
                }
                return file; // <-- store File in form
              }}
              rules={[{ required: true, message: "Please upload an image!" }]}
              noStyle
            >
              {/* Make the input cover the whole box */}
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </Form.Item>
          </div>
        </Form.Item>

        {/* Category Name */}
        <Form.Item
          label="Category Name"
          name="categoryName"
          rules={[
            { required: true, message: "Please input the category name!" },
          ]}
        >
          <Input placeholder="Perfume" />
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

export default AddCategoryModal;
