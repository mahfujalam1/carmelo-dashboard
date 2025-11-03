import IncomeGraphChart from "../../component/Main/Dashboard/IncomeGraphChart";
import NewOrdersTable from "../../component/Main/Dashboard/NewOrderTable";
import Piechart from "../../component/Main/Dashboard/Piechart";
import Status from "../../component/Main/Dashboard/Status";
const DashboardHome = () => {
  return (
    <section>
      <div className="px-3 ">
        <Status />
    
        <div className="w-full h-full lg:h-[50vh]  flex flex-col gap-4 lg:flex-row justify-between items-center my-10">
            {/* Left Column: Chart */}
            <div className="w-full lg:w-[50%] md:w-full  rounded-lg p-1">
              <IncomeGraphChart />
            </div>
            
            {/* Right Column: Pie Chart */}
            <div className="w-full lg:w-[50%] md:w-full">
              <Piechart />
            </div>
          </div>
        <NewOrdersTable />
      </div>
    </section>
  );
};

export default DashboardHome;
