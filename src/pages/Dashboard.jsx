import { ChevronDown, Calendar, Trash2, Truck, UserCheck } from "lucide-react";
import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    const dashboardData = async () => {
      try {
        const response = await fetch("data/dashboard.json");
        const data = await response.json();
        setProductData(data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    dashboardData();
  }, []);

  const formatRupiah = (price) =>
    price
      ? "IDR " +
        new Intl.NumberFormat("id-ID", {
          minimumFractionDigits: 0,
        }).format(price)
      : "-";


  const chartData = [
    { month: "6.22", value: 300 },
    { month: "9.22", value: 350 },
    { month: "8.22", value: 280 },
    { month: "9.23", value: 400 },
    { month: "10.23", value: 450 },
    { month: "11.23", value: 420 },
    { month: "01.24", value: 480 },
    { month: "03.24", value: 500 },
  ];

  const statsCards = [
    {
      title: "Order On Progress",
      value: "200",
      change: "+11.01%",
      color: "bg-[#6FC276]",
      icon: <Trash2 className="text-[#FF8906]" />,
    },
    {
      title: "Order Shiping",
      value: "100",
      change: "+4.01%",
      color: "bg-[#6C69D4]",
      icon: <Truck className="text-[#FF8906]" />,
    },
    {
      title: "Order Done",
      value: "50",
      change: "+2.01%",
      color: "bg-[#C56FBC]",
      icon: <UserCheck className="text-[#FF8906]" />,
    },
  ];

  return (
    <section>
      <section className="grid grid-cols-3 gap-6 mb-8">
        {statsCards.map((card, idx) => (
          <article
            key={idx}
            className={`${card.color} text-white rounded-lg p-6 grid`}
            aria-label={card.title}
          >
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-3">
                <p className="p-2 bg-white rounded-full">{card.icon}</p>
                <p className="text-sm font-bold mt-2">{card.title}</p>
              </div>
              <div className="flex gap-3">
                <p className="text-2xl">{card.value}</p>
                <p className="text-lg">{card.change}</p>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="bg-white rounded-lg p-6 mb-8 shadow-sm border border-gray-200">
        <header className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900 grid grid-cols-1">
            Total Penjualan
            <span className="text-sm text-gray-500 ml-2">
              1000 cup ( 16 - 23 January 2023 )
            </span>
          </h2>
          <button className="flex items-center text-sm text-gray-600 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">
            <Calendar className="w-4 h-4 mr-2" /> 6 Jun 2022 - 30 Jun 2023{" "}
            <ChevronDown className="w-4 h-4 ml-2" />
          </button>
        </header>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="month"
              stroke="#9ca3af"
              style={{ fontSize: "12px" }}
            />
            <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </section>

      <section className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <header className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Produk Terlaris
          </h2>
          <button className="flex items-center text-sm text-gray-600 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">
            6 Jun 2022 - 30 Jun 2023 <ChevronDown className="w-4 h-4 ml-2" />
          </button>
        </header>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">
                  No
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">
                  Nama Product
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">
                  Terjual
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">
                  Keuntungan
                </th>
              </tr>
            </thead>
            <tbody className="text-center">
              {productData.map((item, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-4 px-4 text-sm text-gray-900">{idx + 1}</td>
                  <td className="py-4 px-4 text-sm text-gray-900">
                    {item.name}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">
                    {item.terjual}
                  </td>
                  <td className="py-4 px-4 text-sm font-medium text-green-600">
                    {formatRupiah(item.keuntungan)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
};

export default Dashboard;
