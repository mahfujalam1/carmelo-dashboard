import { useGetCategoriesQuery } from "../../../redux/features/categories/categories";
import { useGetDashboardStatusQuery } from "../../../redux/features/dashboard/dashboardApi";
import { useGetAllTemplatesQuery } from "../../../redux/features/template/templates";
import { useGetAllUsersQuery } from "../../../redux/features/user/userApi";

// src/components/Status.jsx
export default function Status() {
  const { data } = useGetDashboardStatusQuery();
  const { data: users } = useGetAllUsersQuery({ page: 999999, limit: 1 });
  const { data: categories } = useGetCategoriesQuery();
  const templatesCount = useGetAllTemplatesQuery();
  const templatesCountData = templatesCount?.data?.data?.templates?.length || 0;
  const categoriesCount = categories?.data?.length || 0;
  const userCount = users?.data?.total || 0;
  console.log(users);
  const earning = data?.data.total || 0;

  const stats = [
    { label: "Total User", value: userCount },
    { label: "Total Category", value: categoriesCount },
    { label: "Total Earning", value: earning, currency: "USD" },
    { label: "Total Template", value: templatesCountData },
  ];

  const format = (s) =>
    s.currency
      ? new Intl.NumberFormat(undefined, {
          style: "currency",
          currency: s.currency,
          minimumFractionDigits: 0,
        }).format(s.value)
      : new Intl.NumberFormat().format(s.value);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-2xl border bg-gray-100 p-6 text-center shadow-sm py-10"
        >
          <div className="text-5xl text-gray-600 font-semibold tabular-nums">
            {format(s)}
          </div>
          <div className="mt-2 text-lg text-gray-600">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
