import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { useUsersGrowthQuery } from "../../../redux/features/user/userApi";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  Legend
);

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function UserGrowthChart() {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const [year, setYear] = useState(2025);

  // Fetch dynamic data from the API based on the selected year
  const { data, isLoading, error } = useUsersGrowthQuery(year);
  const userData = data?.data || []; // Access the correct data structure

  // Process API data into months and totals
  const chartData = useMemo(() => {
    if (!userData) return new Array(12).fill(0); // Default empty data if no data found
    return MONTHS?.map((_, index) => {
      const monthData = userData.find((item) => item.month === index + 1);
      return monthData ? monthData.count : 0; // Default to 0 if no data for the month
    });
  }, [userData]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");

    // Destroy previous chart instance on re-render
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Create the new chart
    chartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: MONTHS,
        datasets: [
          {
            label: `${year}`,
            data: chartData, // Use dynamic chartData here
            borderColor: "#111827", // slate-900
            borderWidth: 2,
            tension: 0.35,
            pointRadius: 3.5,
            pointHoverRadius: 5,
            pointBackgroundColor: "#ffffff",
            pointBorderColor: "#111827",
            pointBorderWidth: 1.5,
            fill: "start",
            // Responsive gradient based on chart area
            backgroundColor: (context) => {
              const { chart } = context;
              const { ctx, chartArea } = chart;
              if (!chartArea) return "rgba(0,0,0,0.06)";
              const gradient = ctx.createLinearGradient(
                0,
                chartArea.top,
                0,
                chartArea.bottom
              );
              gradient.addColorStop(0, "rgba(17,24,39,0.25)");
              gradient.addColorStop(1, "rgba(17,24,39,0.02)");
              return gradient;
            },
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            mode: "index",
            intersect: false,
            callbacks: {
              label: (ctx) => ` ${ctx.parsed.y}`,
            },
          },
        },
        scales: {
          x: {
            grid: {
              color: "rgba(0,0,0,0.06)",
              drawBorder: false,
            },
            ticks: { color: "#6b7280" }, // gray-500
          },
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(0,0,0,0.06)",
              drawBorder: false,
            },
            ticks: { color: "#6b7280" },
          },
        },
      },
    });

    // Cleanup on component unmount or year change
    return () => {
      chartRef.current && chartRef.current.destroy();
    };
  }, [year, chartData]); // Re-run effect when `year` or `chartData` changes

  return (
    <div className="rounded-2xl border bg-gray-50 p-4 shadow-sm">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-800">User Growth</h3>
        <select
          className="rounded-lg border px-3 py-1.5 text-sm"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        >
          <option value={2025}>2025</option>
          <option value={2024}>2024</option>
        </select>
      </div>

      {/* Chart area */}
      <div className="h-64 md:h-72">
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error loading data</p>
        ) : (
          <canvas ref={canvasRef} />
        )}
      </div>

      <div className="mt-2 text-center text-sm text-gray-500">◌ {year}</div>
    </div>
  );
}
