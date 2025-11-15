import { TbEdit } from "react-icons/tb";
import { Link } from "react-router-dom";
import CustomButton from "../../utils/CustomButton";
import { useGetTermsQuery } from "../../redux/features/Terms&policy/terms-policy";

const TermsConditions = () => {
  const { data } = useGetTermsQuery();
  const terms = data;

  return (
    <section className="w-full h-full min-h-screen">
      <div className="flex justify-between items-center py-5">
        <div className="flex items-center">
          <h1 className="text-2xl font-semibold">Terms & Conditions</h1>
        </div>
        <Link to={"/settings/edit-terms-conditions/11"}>
          <CustomButton border>
            <TbEdit className="size-5" />
            <span>Edit</span>
          </CustomButton>
        </Link>
      </div>

      <div className="px-5 text-lg text-black">
        <div
          dangerouslySetInnerHTML={{
            __html: terms?.data?.content || "",
          }}
        />
      </div>
    </section>
  );
};

export default TermsConditions;
