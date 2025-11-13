import ProductActions from "./ProductAction";


export default function ProductRow({ item }) {
  return (
    <tr className="hover:bg-gray-50/60">
      <td className="px-4 py-3 text-gray-800 font-medium">{item?._id}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-lg bg-gray-200/70 px-2 py-1">
            {item?.images?.slice(0, 3).map((src, i) => (
              <img
                key={i}
                src={src}
                className="h-10 w-10 rounded object-cover"
                alt=""
              />
            ))}
          </div>
        </div>
      </td>
      <td className="px-4 py-3">{item?.name}</td>
      <td className="px-4 py-3">{item?.category?.name}</td>
      <td className="px-4 py-3 tabular-nums">
        {new Intl.NumberFormat().format(item?.price)}
      </td>
      <td className="px-4 py-3">
        <div className="flex justify-end">
          <ProductActions product={item} />
        </div>
      </td>
    </tr>
  );
}
