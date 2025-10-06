import {
  Home,
  Users,
  FileText,
  Settings,
  ChevronDown,
  Calendar,
  Trash2,
  Truck,
  UserCheck,
} from "lucide-react";
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

  const recentItems = [
    {
      name: "Coffe",
      terjual: "300Cup",
      keuntungan: "IDR9.000.000",
    },
    {
      name: "Americano",
      terjual: "400Cup",
      keuntungan: "IDR19.000.000",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50 md:my-20">
      {/* === Sidebar === */}
      <aside
        className="w-64 bg-white border-r border-gray-200"
        aria-label="Sidebar Navigation"
      >
        <header className="p-4">
          <h1 className="font-bold text-xl">Dashboard</h1>
        </header>

        <nav className="mt-8">
          <ul>
            <li>
              <a
                href="#"
                className="flex items-center px-4 py-3 bg-orange-50 text-orange-600 border-r-4 border-orange-600"
              >
                <Home className="w-5 h-5" />
                <span className="ml-3 font-medium">Home</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50"
              >
                <Users className="w-5 h-5" />
                <span className="ml-3">Profile</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50"
              >
                <FileText className="w-5 h-5" />
                <span className="ml-3">Task</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50"
              >
                <Settings className="w-5 h-5" />
                <span className="ml-3">Settings</span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">
        <section className="p-8">
          <section
            aria-labelledby="stats-heading"
            className="grid grid-cols-3 gap-6 mb-8"
          >
            <h2 id="stats-heading" className="sr-only">
              Statistics Overview
            </h2>
            {statsCards.map((card, index) => (
              <article
                key={index}
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
          <section
            aria-labelledby="chart-heading"
            className="bg-white rounded-lg p-6 mb-8 shadow-sm border border-gray-200"
          >
            <header className="flex justify-between items-center mb-6">
              <h2
                id="chart-heading"
                className="text-lg font-semibold text-gray-900 grid grid-cols-1"
              >
                Total Penjualan
                <span className="text-sm text-gray-500 ml-2">
                  1000 cup ( 16 - 23 January 2023 )
                </span>
              </h2>
              <button className="flex items-center text-sm text-gray-600 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">
                <Calendar className="w-4 h-4 mr-2" />
                6 Jun 2022 - 30 Jun 2023
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

          <section
            aria-labelledby="recent-items-heading"
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
          >
            <header className="flex justify-between items-center mb-6">
              <h2
                id="recent-items-heading"
                className="text-lg font-semibold text-gray-900"
              >
                Recent Items
              </h2>
              <button className="flex items-center text-sm text-gray-600 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">
                6 Jun 2022 - 30 Jun 2023
                <ChevronDown className="w-4 h-4 ml-2" />
              </button>
            </header>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th
                      scope="col"
                      className="text-center py-3 px-4 text-sm font-medium text-gray-600"
                    >
                      #
                    </th>
                    <th
                      scope="col"
                      className="text-center py-3 px-4 text-sm font-medium text-gray-600"
                    >
                      Nama Product
                    </th>
                    <th
                      scope="col"
                      className="text-center py-3 px-4 text-sm font-medium text-gray-600"
                    >
                      Terjual
                    </th>
                    <th
                      scope="col"
                      className="text-center py-3 px-4 text-sm font-medium text-gray-600"
                    >
                      Keuntungan
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentItems.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-4 px-4 text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-900 text-center">
                        {item.name}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600 text-center">
                        {item.terjual}
                      </td>
                      <td className="py-4 px-4 text-sm font-medium text-green-600 text-center">
                        {item.keuntungan}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
