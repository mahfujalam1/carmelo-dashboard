import { IoChevronBack } from "react-icons/io5";
import { Link } from "react-router-dom";
import { Button, Form } from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useEffect, useState } from "react";
import CustomButton from "../../utils/CustomButton";
import {
  useGetPolicyQuery,
  useUpdatePolicyMutation,
} from "../../redux/features/Terms&policy/terms-policy";
import { toast } from "sonner";

const EditPrivacyPolicy = () => {
  const [form] = Form.useForm();
  const { data } = useGetPolicyQuery();
  const policy = data?.data;
  const policyData = policy?.content;

  const [content, setContent] = useState("");
  const [updatepolicy, { isLoading }] = useUpdatePolicyMutation();

  useEffect(() => {
    if (policyData) {
      setContent(policyData);
      form.setFieldsValue({ content: policyData });
    }
  }, [policyData, form]);

  const handleSubmit = async () => {
    const payload = {
      content,
      type: "policy",
    };

    try {
      await updatepolicy(payload).unwrap();
      toast.success("Successfully Updated privacy policy");
      console.log("Updated:", payload);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <section className="w-full h-full min-h-screen">
      <div className="flex justify-between items-center py-5">
        <div className="flex items-center">
          
          <h1 className="text-2xl font-semibold">Edit policy and Conditions</h1>
        </div>
      </div>

      <div className="w-full p-6 rounded-lg shadow-md">
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="content">
            <ReactQuill
              value={content}
              onChange={(value) => {
                setContent(value);
                form.setFieldsValue({ content: value });
              }}
              modules={{
                toolbar: [
                  [{ header: [1, 2, 3, false] }],
                  [{ font: [] }],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["bold", "italic", "underline", "strike"],
                  [{ align: [] }],
                  [{ color: [] }, { background: [] }],
                  ["blockquote", "code-block"],
                  ["link", "image", "video"],
                  [{ script: "sub" }, { script: "super" }],
                  [{ indent: "-1" }, { indent: "+1" }],
                  ["clean"],
                ],
              }}
              style={{ height: "300px" }}
            />
          </Form.Item>

          <div className="w-full flex justify-end mt-20 md:mt-16 gap-3">
            <Button
              type="default"
              className="mt-1 px-5 rounded-lg py-5"
              onClick={() => form.resetFields()}
            >
              Cancel
            </Button>

            <CustomButton
              className="p-1"
              htmlType="submit"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update"}
            </CustomButton>
          </div>
        </Form>
      </div>
    </section>
  );
};

export default EditPrivacyPolicy;
