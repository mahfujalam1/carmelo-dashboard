import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Input, Select, Button, Form, Upload, message } from "antd";
import { useGetCategoriesQuery } from "../../../redux/features/categories/categories";
import { PlusOutlined } from "@ant-design/icons";
import { useAddProductMutation } from "../../../redux/features/product/productApi";

const { TextArea } = Input;

const ProductCreateModal = ({ onClose, onSave }) => {
  const [form] = Form.useForm();
  const [files, setFiles] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [addProduct] = useAddProductMutation();
  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useGetCategoriesQuery();

  useEffect(() => {
    if (categoriesData) {
      setCategories(categoriesData?.data || []);
    }
  }, [categoriesData]);

  const handleFileChange = (info) => {
    const { fileList } = info;
    setFiles(fileList);
  };

  const handleAddProduct = async (values) => {
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
      console.log(formData);
      await addProduct(formData).unwrap();
      onSave();
      onClose();
    } catch (error) {
      console.error("Error adding product:", error);
      message.error("Failed to add product.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-6 flex items-center justify-between border-b pb-3">
          <h2 className="text-xl font-semibold">Create Product</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <Form
          form={form}
          onFinish={handleAddProduct}
          layout="vertical"
          className=""
        >
          {/* Upload Product Images */}
          <Form.Item label="Upload Product Images" valuePropName="fileList">
            <Upload
              listType="picture-circle" // Default list type for normal file upload
              multiple
              accept="image/*"
              onChange={handleFileChange}
              beforeUpload={() => false} // Prevent automatic upload
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
                {categories.map((category) => (
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
                <Select.Option value={true}>Yes</Select.Option>
                <Select.Option value={false}>No</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="sizes"
              label="Select Sizes"
              rules={[
                { required: true, message: "Please select at least one size" },
              ]}
            >
              <Select
                mode="multiple"
                placeholder="Select sizes"
                onChange={(value) => setSizes(value)}
                options={[
                  { value: "XS", label: "XS" },
                  { value: "S", label: "S" },
                  { value: "M", label: "M" },
                  { value: "L", label: "L" },
                  { value: "XL", label: "XL" },
                  { value: "XXL", label: "XXL" },
                ]}
              />
            </Form.Item>
          </div>

          {/* Description */}
          <Form.Item name="description" label="Description">
            <TextArea rows={4} placeholder="Product description" />
          </Form.Item>

          {/* Submit and Cancel Buttons */}
          <div className="flex justify-center gap-4 pt-4">
            <Button type="primary" htmlType="submit">
              Publish
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

export default ProductCreateModal;
