/* eslint-disable no-unused-vars */
import { useState } from "react";
import {
  ConfigProvider,
  Modal,
  Table,
  Form,
  Input,
  DatePicker,
  message,
  Avatar,
  Button,
  Popconfirm,
} from "antd";
import moment from "moment";
import { IoIosSearch, IoMdInformationCircleOutline } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import {
  useDeleteUserMutation,
  useGetAllUsersQuery,
} from "../../../redux/features/user/userApi";
import { Eye, Trash2 } from "lucide-react";

const { Item } = Form;

const Users = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalViewOpen, setIsModalViewOpen] = useState(false);
  const [user, setUser] = useState(null);

  const { data, isFetching, isError } = useGetAllUsersQuery({
    page: currentPage,
    limit: 25,
  });
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  console.log(data);

  const handleView = (record) => {
    setUser(record);
    setIsModalViewOpen(true);
  };

  const handleConfirmDelete = async (id) => {
    console.log("deleted id=>",id)
    try {
      await deleteUser(id).unwrap();
      message.success("User deleted successfully");
    } catch (e) {
      console.error(e);
      message.error("Failed to delete user");
    }
  };

  const dataSource =
    data?.data?.users?.map((user, index) => ({
      id: user._id,
      si: index + 1 + (currentPage - 1) * 25,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      address: user.address,
      createdAt: user.createdAt,
      imageUrl: user.avatar,
      accountID: user._id,
      status: user.isDeleted ? "Deleted" : "Active",
      block: user.isBlocked,
    })) || [];

  const columns = [
    {
      title: "#SI",
      dataIndex: "si",
      key: "si",
      width: 70,
      sorter: (a, b) => a.si - b.si,
    },
    {
      title: "User Info",
      key: "userInfo",
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          <img
            src={record.imageUrl || "https://avatar.iran.liara.run/public/34"}
            alt="profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-medium">{record.fullName || "N/A"}</p>
            <p className="text-gray-500 text-sm">{record.phone || "N/A"}</p>
          </div>
        </div>
      ),
      sorter: (a, b) => a.fullName?.localeCompare(b.fullName),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email?.localeCompare(b.email),
    },
    {
      title: "Location",
      dataIndex: "address",
      key: "address",
      sorter: (a, b) => a.address?.localeCompare(b.address),
      render: (text) => text || "N/A",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex items-center space-x-4">
          <Eye
            size={16}
            className="cursor-pointer text-gray-800"
            onClick={() => handleView(record)}
          />
          <Popconfirm
            title="Are you sure you want to delete?"
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true, loading: isDeleting }}
            onConfirm={(e) => {
              e?.stopPropagation();
              handleConfirmDelete(record.id);
            }}
            onCancel={(e) => e?.stopPropagation()}
          >
            <Button
              danger
              disabled={isDeleting}
              onClick={(e) => e.stopPropagation()}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <section>
      <div className="md:flex justify-between items-center py-6 mb-4">
        <h1 className="text-2xl font-semibold">All Users</h1>
        <Form layout="inline" className="flex space-x-4">
          <Item name="date">
            <DatePicker
              className="rounded-md border border-gray-600"
              onChange={(date) => setSelectedDate(date)}
              placeholder="Select Date"
            />
          </Item>
          <Item name="username">
            <Input
              className="rounded-md w-[70%] md:w-full border border-gray-600"
              placeholder="Search by name or email"
              onChange={(e) => setSearchText(e.target.value)}
              value={searchText}
            />
          </Item>
          <Item>
            <button
              type="button"
              onClick={() => setCurrentPage(1)}
              className="size-8 rounded-full flex justify-center items-center border-2"
            >
              <IoIosSearch className="size-5" />
            </button>
          </Item>
        </Form>
      </div>

      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: "#00",
              headerColor: "#000",
              headerBorderRadius: 5,
            },
          },
        }}
      >
        <Table
          loading={isFetching}
          pagination={{
            pageSize: 25,
            position: ["bottomCenter"],
            current: currentPage,
            onChange: setCurrentPage,
          }}
          scroll={{ x: "max-content" }}
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
        />
      </ConfigProvider>

      <Modal
        open={isModalViewOpen}
        onCancel={() => setIsModalViewOpen(false)}
        footer={null}
        centered
      >
        <div className="text-black">
          <div className="p-5">
            <div className="flex items-center">
              <img
                className="size-24 rounded-full"
                src={user?.imageUrl || "https://via.placeholder.com/100"}
                alt="Profile"
              />
              <div className="ml-5">
                <h1 className="text-xl font-semibold">
                  {user?.fullName || "N/A"}
                </h1>
                <p className="text-gray-500">{user?.email || "N/A"}</p>
                <p className="text-gray-500">{user?.phone || "N/A"}</p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex justify-between border-b py-2">
                <p>Account ID:</p>
                <p>{user?.accountID || "N/A"}</p>
              </div>
              <div className="flex justify-between border-b py-2">
                <p>Address:</p>
                <p>{user?.address || "N/A"}</p>
              </div>
              <div className="flex justify-between border-b py-2">
                <p>Status:</p>
                <p>{user?.status || "Active"}</p>
              </div>
              <div className="flex justify-between border-b py-2">
                <p>Joining Date:</p>
                <p>{moment(user?.createdAt).format("YYYY-MM-DD") || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </section>
  );
};

export default Users;
