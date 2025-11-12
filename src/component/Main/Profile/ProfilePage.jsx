import React, { useEffect, useState } from "react";
import { Card, Input, Button, Avatar, Form } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import {
  useChangePasswordMutation,
  useUdpateMyProfileMutation,
} from "../../../redux/features/user/userApi";
import { useGetMyProfileQuery } from "../../../redux/features/auth/authApi";
import { toast } from "sonner";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("editProfile");
  const { data } = useGetMyProfileQuery();
  const [updateProfile] = useUdpateMyProfileMutation();
  const [changePassword] = useChangePasswordMutation();
  const userData = data?.data;
  const [form] = Form.useForm();

  useEffect(() => {
    if (userData) {
      form.setFieldsValue({
        fullName: userData?.fullName,
        email: userData?.email, // Email is set but will not be submitted
        address: userData?.address,
        phone: userData?.phone,
      });
    }
  }, [userData, form]);

  // Handle profile update form submission
  const handleUpdateProfile = async (values) => {
    try {
      // Remove email from values before sending to the API
      const { email, ...profileData } = values;
      // Call API with updated data excluding email
      const res = await updateProfile(profileData).unwrap();
      toast.success(res.message); // Show success message
    } catch (error) {
      toast.error("Failed to update profile"); // Show error message
    }
  };

  // Handle password change form submission
  const handlePasswordChange = async (values) => {
    const { previousPassword, newPassword, confirmPassword } = values;
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match"); // Show error if passwords don't match
      return;
    }
    try {
      await changePassword({ previousPassword, newPassword }).unwrap();
      toast.success("Password changed successfully"); // Show success message
    } catch (error) {
      toast.error("Failed to change password"); // Show error message
    }
  };

  const renderForm = () => {
    if (activeTab === "editProfile") {
      return (
        <div className="w-full max-w-md mx-auto">
          <h3 className="text-center mb-6 font-medium text-gray-700 text-lg">
            Edit Your Profile
          </h3>
          <div className="space-y-4">
            <Form
              form={form}
              layout="vertical"
              requiredMark={false}
              onFinish={handleUpdateProfile}
            >
              <Form.Item
                name="fullName"
                label="Full Name"
                rules={[
                  { required: true, message: "Please enter your full name" },
                ]}
              >
                <Input placeholder="User Name" size="large" />
              </Form.Item>
              <Form.Item name="email" label="Email">
                <Input placeholder="Enter your email" readOnly size="large" />
              </Form.Item>
              <Form.Item
                name="phone"
                label="Phone"
                rules={[
                  { required: true, message: "Please enter your phone number" },
                ]}
              >
                <Input placeholder="Contact No" size="large" />
              </Form.Item>
              <Form.Item
                name="address"
                label="Address"
                rules={[
                  { required: true, message: "Please enter your address" },
                ]}
              >
                <Input placeholder="Enter your address" size="large" />
              </Form.Item>
              <Form.Item>
                <Button
                  htmlType="submit"
                  type="primary"
                  block
                  style={{
                    backgroundColor: "#000",
                    color: "#fff",
                    height: 40,
                    fontWeight: 500,
                  }}
                >
                  Save & Change
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      );
    } else {
      return (
        <div className="w-full max-w-md mx-auto">
          <h3 className="text-center mb-6 font-medium text-gray-700 text-lg">
            Change Your Password
          </h3>
          <div className="space-y-4">
            <Form onFinish={handlePasswordChange} layout="vertical">
              <Form.Item
                name="previousPassword"
                label="Current Password"
                rules={[
                  {
                    required: true,
                    message: "Please enter your current password",
                  },
                ]}
              >
                <Input.Password
                  placeholder="Current Password"
                  size="large"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>
              <Form.Item
                name="newPassword"
                label="New Password"
                rules={[
                  { required: true, message: "Please enter a new password" },
                ]}
              >
                <Input.Password
                  placeholder="New Password"
                  size="large"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>
              <Form.Item
                name="confirmPassword"
                label="Confirm New Password"
                rules={[
                  {
                    required: true,
                    message: "Please confirm your new password",
                  },
                ]}
              >
                <Input.Password
                  placeholder="Confirm New Password"
                  size="large"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>
              <Form.Item>
                <Button
                  htmlType="submit"
                  type="primary"
                  block
                  style={{
                    backgroundColor: "#000",
                    color: "#fff",
                    height: 40,
                    fontWeight: 500,
                  }}
                >
                  Send & Change
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex justify-center py-10">
      <Card className="w-full max-w-2xl p-8 border-none shadow-none">
        <div className="flex flex-col items-center">
          <Avatar
            size={100}
            src={userData?.avatar || "https://i.pravatar.cc/150?img=3"}
          />
          <h2 className="mt-3 text-xl font-semibold">{userData?.fullName}</h2>
          <p className="text-gray-500 text-sm">@{userData?.role}</p>

          {/* Tabs below image */}
          <div className="mt-6 flex gap-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("editProfile")}
              className={`pb-2 text-sm font-medium transition-colors ${
                activeTab === "editProfile"
                  ? "border-b-2 border-black text-black"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              Edit Profile
            </button>
            <button
              onClick={() => setActiveTab("changePassword")}
              className={`pb-2 text-sm font-medium transition-colors ${
                activeTab === "changePassword"
                  ? "border-b-2 border-black text-black"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              Change Password
            </button>
          </div>

          <div className="mt-8 w-full">{renderForm()}</div>
        </div>
      </Card>
    </div>
  );
}
