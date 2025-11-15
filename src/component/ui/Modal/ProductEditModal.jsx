import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Input, Select, Button, Form, Upload, message } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useGetCategoriesQuery } from "../../../redux/features/categories/categories";
import { useUpdateProductMutation } from "../../../redux/features/product/productApi";

const { TextArea } = Input;

const ProductEditModal = ({ open, onClose, onSave, initialData }) => {
  const [form] = Form.useForm();
  const [files, setFiles] = useState([]);
  const [oldImages, setOldImages] = useState([]); // ADDED
  const [sizes, setSizes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [updateProduct] = useUpdateProductMutation();

  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useGetCategoriesQuery();

  useEffect(() => {
    if (categoriesData) {
      setCategories(categoriesData?.data || []);
    }

    if (initialData) {
      form.setFieldsValue({
        name: initialData.name,
        title: initialData.title,
        category: initialData.category?._id,
        price: initialData.price,
        condition: initialData.condition,
        description: initialData.description,
        swappable: initialData.swappable ? "true" : "false",
      });

      if (initialData.images?.length) {
        const mapped = initialData.images.map((url, index) => ({
          uid: String(index),
          name: `image-${index}`,
          status: "done",
          url,
          isOld: true, // ADDED
        }));
        setFiles(mapped);
        setOldImages(initialData.images); // ADDED
      }

      if (initialData.sizes?.length) {
        setSizes(initialData.sizes);
        form.setFieldsValue({ sizes: initialData.sizes });
      }
    }
  }, [categoriesData, initialData, form]);

  const handleFileChange = ({ fileList }) => {
    setFiles(
      fileList.map((file) => ({
        ...file,
        uid: file.uid || String(Math.random()),
      }))
    );
  };

  const handleRemoveImage = (file) => {
    // REMOVE old url from array
    if (file.isOld) {
      setOldImages((prev) => prev.filter((img) => img !== file.url));
    }

    setFiles((prevFiles) => prevFiles.filter((f) => f.uid !== file.uid));
  };

  const handleUpdateProduct = async (values) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("name", values.name);
    formData.append("categoryId", values.category);
    formData.append("price", values.price);
    formData.append("condition", values.condition);
    formData.append("description", values.description);
    formData.append("swappable", values.swappable === "true");

    // NEW images => append as files
    files.forEach((file) => {
      if (!file.isOld && file.originFileObj) {
        formData.append("images", file.originFileObj);
      }
    });

    // OLD images => append as URLs
    oldImages.forEach((url) => {
      formData.append("old_images[]", url);
    });

    formData.append("sizes", `[${sizes.join(",")}]`);

    try {

      await updateProduct({ id: initialData._id, formdata: formData }).unwrap();
      onSave();
      onClose();
    } catch (error) {
      console.error("Error updating product:", error);
      message.error("Failed to update product.");
    }
  };

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
          <Form.Item label="Upload Product Images" valuePropName="fileList">
            <Upload
              listType="picture-card"
              multiple
              accept="image/*"
              beforeUpload={() => false}
              fileList={files}
              onChange={handleFileChange}
              onRemove={handleRemoveImage}
              showUploadList={{
                showPreviewIcon: false,
                showRemoveIcon: true,
                removeIcon: <DeleteOutlined style={{ color: "red" }} />, // DELETE ONLY
              }}
            >
              <Button icon={<PlusOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>

          <div className="grid grid-cols-2 gap-5">
            <Form.Item
              name="name"
              label="Product Name"
              rules={[{ required: true, message: "Product name is required" }]}
            >
              <Input placeholder="Product Name" />
            </Form.Item>

            <Form.Item name="title" label="Product Title">
              <Input placeholder="Product Title" />
            </Form.Item>

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

            <Form.Item
              name="price"
              label="Price"
              rules={[{ required: true, message: "Price is required" }]}
            >
              <Input type="number" placeholder="Price" />
            </Form.Item>

            <Form.Item
              name="condition"
              label="Condition"
              rules={[{ required: true, message: "Condition is required" }]}
            >
              <Select placeholder="Select Condition">
                <Select.Option value="new">New</Select.Option>
                <Select.Option value="used">Gently Used</Select.Option>
              </Select>
            </Form.Item>

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

            <Form.Item
              name="sizes"
              label="Available Sizes"
              rules={[
                { required: true, message: "Please select at least one size" },
              ]}
            >
              <Select
                mode="multiple"
                placeholder="Select sizes"
                value={sizes}
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

          <Form.Item name="description" label="Description">
            <TextArea rows={4} placeholder="Product description" />
          </Form.Item>

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
