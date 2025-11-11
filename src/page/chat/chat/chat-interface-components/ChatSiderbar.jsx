import { useGetChatsQuery } from "../../../../redux/features/chat/chatApis";

function ChatSiderbar({ setSelectedUser }) {
  const { data: userData, isLoading: userDataLoading } = useGetChatsQuery();
  return (
    <div className="w-[350px] h-full shadow p-1">
      <input
        className="w-full p-2 h-[50px] border outline-none border-gray-200 rounded mb-4"
        type="text"
        placeholder={` Search`}
        onChange={(e) => console.log(e.target.value)}
      />
      <div className="max-h-[calc(100vh-155px)] hide-scrollbar overflow-y-auto">
        {userData?.data?.map((item, index) => (
          <UserChat key={index} data={item} setSelectedUser={setSelectedUser} />
        ))}
      </div>
    </div>
  );
}

export default ChatSiderbar;

const UserChat = ({ data, setSelectedUser }) => {
  console.log(data);
  return (
    <div
      onClick={() => {
        setSelectedUser(data?.user2);
        localStorage.setItem("selectedUser", JSON.stringify(data?.user2));
      }}
      className="flex gap-2 hover:bg-gray-100 p-2 cursor-pointer space-y-2 mb-2 border-b pb-2 border-gray-200 w-full items-center"
    >
      <img
        className="min-w-12 w-12 h-12 min-h-12 border border-gray-200 shadow rounded-full"
        src={data?.user2?.avatar}
        alt={data?.user2?.fullName}
      />
      <div>
        <p className="text-lg font-semibold">{data?.user2?.fullName}</p>
      </div>
    </div>
  );
};
