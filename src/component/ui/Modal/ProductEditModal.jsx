import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Input, Select, Button, Form, Upload, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useGetCategoriesQuery } from "../../../redux/features/categories/categories";
import { useUpdateProductMutation } from "../../../redux/features/product/productApi";

const { TextArea } = Input;

const ProductEditModal = ({ open, onClose, onSave, initialData }) => {
  const [form] = Form.useForm();
  const [files, setFiles] = useState([]); // To store selected files
  const [sizes, setSizes] = useState([]); // To store product sizes
  const [categories, setCategories] = useState([]); // To store product categories
  const [updateProduct] = useUpdateProductMutation();

  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useGetCategoriesQuery();

  // Set categories and initial data when modal is opened
  useEffect(() => {
    if (categoriesData) {
      setCategories(categoriesData?.data || []);
    }

    if (initialData) {
      form.setFieldsValue({
        name: initialData.name,
        title: initialData.title,
        category: initialData.category?._id, // Ensure category is selected
        price: initialData.price,
        condition: initialData.condition,
        description: initialData.description,
        swappable: initialData.swappable ? "true" : "false",
      });

      // Set existing images
      if (initialData.images?.length) {
        const mapped = initialData.images.map((url) => ({
          file: null,
          url,
          isExisting: true,
        }));
        setFiles(mapped); // Populate with existing images
      }

      // Set existing sizes
      if (initialData.sizes?.length) {
        setSizes(initialData.sizes);
      }
    }
  }, [categoriesData, initialData, form]);

  // Handle file changes
  const handleFileChange = (info) => {
    const { fileList } = info;
    setFiles(fileList); // Update state with new file list
  };

  // Handle image removal
  const handleRemoveImage = (file) => {
    setFiles((prevFiles) => prevFiles.filter((f) => f.uid !== file.uid)); // Remove file by uid
  };

  // Handle product update
  const handleUpdateProduct = async (values) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("name", values.name);
    formData.append("categoryId", values.category);
    formData.append("price", values.price);
    formData.append("condition", values.condition);
    formData.append("description", values.description);
    formData.append("swappable", values.swappable);

    // Add images to formData
    files.forEach((file) => {
      formData.append("images", file.originFileObj);
    });

    formData.append("sizes", `[${sizes.join(",")}]`);

    try {
      await updateProduct({ id: initialData._id, formdata: formData }).unwrap(); // Pass id and formData
      onSave(); // Trigger save callback in parent
      onClose(); // Close the modal after successful update
    } catch (error) {
      console.error("Error updating product:", error);
      message.error("Failed to update product.");
    }
  };

  // If modal is not open, return null to prevent rendering
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-6 flex items-center justify-between border-b pb-3">
          <h2 className="text-xl font-semibold">Edit Product</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <Form
          form={form}
          onFinish={handleUpdateProduct}
          layout="vertical"
          className="space-y-6"
        >
          {/* Upload Product Images */}
          <Form.Item label="Upload Product Images" valuePropName="fileList">
            <Upload
              listType="picture-circle"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              onRemove={handleRemoveImage} // Remove image handler
              beforeUpload={() => false} // Prevent automatic upload
              fileList={files} // Controlled file list state
            >
              <Button icon={<PlusOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>

          <div className="grid grid-cols-2 gap-5">
            {/* Product Name */}
            <Form.Item
              name="name"
              label="Product Name"
              rules={[{ required: true, message: "Product name is required" }]}
            >
              <Input placeholder="Product Name" />
            </Form.Item>

            {/* Product Title */}
            <Form.Item name="title" label="Product Title">
              <Input placeholder="Product Title" />
            </Form.Item>

            {/* Category */}
            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: "Category is required" }]}
            >
              <Select
                loading={isCategoriesLoading}
                placeholder="Select Category"
              >
                {categories?.map((category) => (
                  <Select.Option key={category._id} value={category._id}>
                    {category.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            {/* Price */}
            <Form.Item
              name="price"
              label="Price"
              rules={[{ required: true, message: "Price is required" }]}
            >
              <Input type="number" placeholder="Price" />
            </Form.Item>

            {/* Condition */}
            <Form.Item
              name="condition"
              label="Condition"
              rules={[{ required: true, message: "Condition is required" }]}
            >
              <Select placeholder="Select Condition">
                <Select.Option value="new">New</Select.Option>
                <Select.Option value="gently_used">Gently Used</Select.Option>
              </Select>
            </Form.Item>

            {/* Swappable */}
            <Form.Item
              name="swappable"
              label="Swappable"
              rules={[
                { required: true, message: "Swappable option is required" },
              ]}
            >
              <Select placeholder="Select Swappable Option">
                <Select.Option value="true">Yes</Select.Option>
                <Select.Option value="false">No</Select.Option>
              </Select>
            </Form.Item>
          </div>

          {/* Description */}
          <Form.Item name="description" label="Description">
            <TextArea rows={4} placeholder="Product description" />
          </Form.Item>

          {/* Submit and Cancel Buttons */}
          <div className="flex justify-center gap-4 pt-4">
            <Button type="primary" htmlType="submit">
              Update
            </Button>
            <Button onClick={onClose} type="default">
              Cancel
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ProductEditModal;
