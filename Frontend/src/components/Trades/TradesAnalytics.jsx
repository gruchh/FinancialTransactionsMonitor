import { useState } from "react";
import {tradeItems} from "./tradeItems";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar 
} from "recharts";

const TradesAnalytics = () => {
  const [activeTab, setActiveTab] = useState("timeline");

  const timelineData = tradeItems
    .sort((a, b) => new Date(a.tradeDate) - new Date(b.tradeDate))
    .map((trade) => ({
      date: new Date(trade.tradeDate).toLocaleDateString("pl-PL", {
        month: "short",
        day: "numeric",
      }),
      value: trade.totalValuePln,
      type: trade.type,
      fund: trade.fund.name.split(" ")[0],
    }));

  const typeAnalysis = tradeItems.reduce((acc, trade) => {
    const existing = acc.find((item) => item.type === trade.type);
    if (existing) {
      existing.count += 1;
      existing.totalValue += trade.totalValuePln;
    } else {
      acc.push({
        type: trade.type,
        count: 1,
        totalValue: trade.totalValuePln,
      });
    }
    return acc;
  }, []);

  const fundAnalysis = tradeItems.reduce((acc, trade) => {
    const fundName = trade.fund.name.split(" ")[0]; // Pierwsza część nazwy
    const existing = acc.find((item) => item.name === fundName);
    if (existing) {
      existing.value += trade.totalValuePln;
      existing.trades += 1;
    } else {
      acc.push({
        name: fundName,
        value: trade.totalValuePln,
        trades: 1,
      });
    }
    return acc;
  }, []);

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7c7c", "#8dd1e1"];

  const totalValue = tradeItems.reduce(
    (sum, trade) => sum + trade.totalValuePln,
    0
  );
  const buyTrades = tradeItems.filter((t) => t.type === "BUY").length;
  const sellTrades = tradeItems.filter((t) => t.type === "SELL").length;
  const avgTradeValue = totalValue / tradeItems.length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Analiza Transakcji
        </h1>

        {/* Statystyki ogólne */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
            <h3 className="text-lg font-semibold text-gray-700">
              Łączna wartość
            </h3>
            <p className="text-2xl font-bold text-blue-600">
              {totalValue.toLocaleString("pl-PL")} PLN
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-500">
            <h3 className="text-lg font-semibold text-gray-700">
              Transakcje kupna
            </h3>
            <p className="text-2xl font-bold text-green-600">{buyTrades}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-red-500">
            <h3 className="text-lg font-semibold text-gray-700">
              Transakcje sprzedaży
            </h3>
            <p className="text-2xl font-bold text-red-600">{sellTrades}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-purple-500">
            <h3 className="text-lg font-semibold text-gray-700">
              Średnia wartość
            </h3>
            <p className="text-2xl font-bold text-purple-600">
              {avgTradeValue.toLocaleString("pl-PL", {
                maximumFractionDigits: 0,
              })}{" "}
              PLN
            </p>
          </div>
        </div>

        {/* Nawigacja między wykresami */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab("timeline")}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === "timeline"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Oś czasu
          </button>
          <button
            onClick={() => setActiveTab("types")}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === "types"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Typy transakcji
          </button>
          <button
            onClick={() => setActiveTab("funds")}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === "funds"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Fundusze
          </button>
        </div>

        {/* Wykresy */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          {activeTab === "timeline" && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Wartość transakcji w czasie
              </h2>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis
                    tickFormatter={(value) => {
                      if (value >= 1000) {
                        return `${(value / 1000).toFixed(0)}k PLN`;
                      }
                      return `${value} PLN`;
                    }}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value) => [
                      `${value.toLocaleString("pl-PL")} PLN`,
                      "Wartość",
                    ]}
                    labelFormatter={(label, payload) => {
                      if (payload && payload[0]) {
                        return `${label} - ${payload[0].payload.fund} (${payload[0].payload.type})`;
                      }
                      return label;
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
                    strokeWidth={3}
                    dot={{ fill: "#8884d8", strokeWidth: 2, r: 6 }}
                    name="Wartość transakcji"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {activeTab === "types" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Podział według typu transakcji
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={typeAnalysis}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ type, count, percent }) =>
                        `${type}: ${count} (${(percent * 100).toFixed(0)}%)`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {typeAnalysis.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Wartość według typu
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={typeAnalysis}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      formatter={(value) => [
                        `${value.toLocaleString("pl-PL")} PLN`,
                        "Wartość",
                      ]}
                    />
                    <Bar dataKey="totalValue" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === "funds" && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Podział według funduszy
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={fundAnalysis}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(1)}%`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {fundAnalysis.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [
                        `${value.toLocaleString("pl-PL")} PLN`,
                        "Wartość",
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Szczegóły funduszy
                  </h3>
                  {fundAnalysis.map((fund, index) => (
                    <div
                      key={fund.name}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        ></div>
                        <span className="font-medium text-gray-700">
                          {fund.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          {fund.value.toLocaleString("pl-PL")} PLN
                        </div>
                        <div className="text-sm text-gray-600">
                          {fund.trades} transakcj
                          {fund.trades === 1
                            ? "a"
                            : fund.trades < 5
                            ? "e"
                            : "i"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TradesAnalytics;