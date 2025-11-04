// ProfilePage.jsx — styled same as provided image
import React, { useState } from "react";
import { Card, Input, Button, Avatar } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("editProfile");

  const renderForm = () => {
    if (activeTab === "editProfile") {
      return (
        <div className="w-full max-w-md mx-auto">
          <h3 className="text-center mb-6 font-medium text-gray-700 text-lg">
            Edit Your Profile
          </h3>
          <div className="space-y-4">
            <Input
              placeholder="User Name"
              defaultValue="AnisulAqman"
              size="large"
            />
            <Input
              placeholder="Email"
              defaultValue="Anisul@gmail.com"
              size="large"
            />
            <Input
              placeholder="Contact No"
              defaultValue="+8801236789237"
              size="large"
            />
            <Input
              placeholder="Address"
              defaultValue="71/A Joker Villa, Gotham City"
              size="large"
            />
            <Button
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
          </div>
        </div>
      );
    } else {
      return (
        <div className="w-full max-w-md mx-auto">
          <h3 className="text-center mb-6 font-medium text-gray-700 text-lg">
            Edit Your Profile
          </h3>
          <div className="space-y-4">
            <Input.Password
              placeholder="Current Password"
              size="large"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
            <Input.Password
              placeholder="New Password"
              size="large"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
            <Input.Password
              placeholder="Confirm New Password"
              size="large"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
            <Button
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
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex justify-center py-10">
      <Card className="w-full max-w-2xl p-8 border-none shadow-none">
        <div className="flex flex-col items-center">
          <Avatar size={100} src="https://i.pravatar.cc/150?img=3" />
          <h2 className="mt-3 text-xl font-semibold">Mr. Admin</h2>
          <p className="text-gray-500 text-sm">@admin</p>

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
