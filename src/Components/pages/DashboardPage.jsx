import { useEffect } from "react";
import Plotly from "plotly.js-dist-min";
import Header from "../Header";
import Sidebar from "../components/Sidebar";

function DashboardPage() {

  useEffect(() => {
    const data = [
      {
        type: "bar",
        x: ["Technical SEO", "Content", "Popularity", "UX/UI"],
        y: [82, 65, 58, 75],
        marker: { color: ["#10b981", "#eab308", "#f97316", "#10b981"] },
      },
    ];

    const layout = {
      yaxis: { range: [0, 100] },
      margin: { t: 20 },
      font: { family: "Inter, sans-serif" },
    };

    Plotly.newPlot("category-bar-chart", data, layout, {
      responsive: true,
      displayModeBar: false,
    });
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header avec logique auth */}
      <Header />

      <div className="flex pt-16 min-h-screen">
        <Sidebar />

        <main className="ml-64 flex-1 p-8">
          <h1 className="text-3xl font-bold mb-6">SEO Dashboard</h1>

          {/* Score Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow border">
              <h2 className="text-lg font-semibold mb-4 text-center">
                Global SEO Score
              </h2>
              <p className="text-5xl font-bold text-center text-primary">
                70
              </p>
            </div>

            <div className="col-span-1 md:col-span-2 bg-white p-6 rounded-xl shadow border">
              <h2 className="font-semibold mb-4">Category Performance</h2>
              <div id="category-bar-chart" className="h-[300px] md:h-[350px]" />
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}

export default DashboardPage;