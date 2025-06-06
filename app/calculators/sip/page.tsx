"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Slider } from "@/components/ui/slider";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function SIPCalculator() {
  const router = useRouter();

  const [initialInvestment, setIntialInvestment] = useState(0);
  const [monthlyInvestment, setMonthlyInvestment] = useState(1000);
  const [rate, setRate] = useState([12]);
  const [years, setYears] = useState([20]);
  const [returns, setReturns] = useState<number | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);

  function calculate() {
    const monthlyRate = rate[0] / 100 / 12;
    const months = years[0] * 12;
    const fv =
      -(monthlyInvestment *
        ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)) -
      initialInvestment * Math.pow(1 + monthlyRate, months);
    setReturns(-fv);

    // Prepare chart data (year-wise)
    const data = [];
    for (let y = 0; y <= years[0]; y++) {
      const m = y * 12;
      const value =
        -(monthlyInvestment *
          ((Math.pow(1 + monthlyRate, m) - 1) / monthlyRate)) -
        initialInvestment * Math.pow(1 + monthlyRate, m);

      // Cumulative investment = initial + monthly * months
      const investment = initialInvestment + monthlyInvestment * m;

      data.push({
        year: y,
        value: parseFloat((-value).toFixed(2)),
        investment: investment,
      });
    }
    setChartData(data);
  }

  useEffect(() => {
    calculate();
  }, [initialInvestment, monthlyInvestment, rate, years]);

  return (
    <div className="flex flex-col items-center justify-start w-full h-full lg:p-14 p-2">
      <div className="w-full md:w-1/2">
        <Card className="w-full p-8">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => router.back()}
              className="rounded-full w-10 h-10 cursor-pointer"
            >
              <ArrowLeft />
            </Button>
            <h2 className="text-2xl font-bold text-center">SIP Calculator</h2>
            <div></div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="space-y-2 w-full">
                <Label htmlFor="initialInvestment">Initial Investment (₹)</Label>
                <Input
                  id="initialInvestment"
                  type="number"
                  placeholder="e.g. 1000"
                  defaultValue={0}
                  className="bg-white dark:bg-zinc-800"
                  onChange={(e) => setIntialInvestment(+e.target.value)}
                />
              </div>
              <div className="space-y-2 w-full">
                <Label htmlFor="monthlyInvestment">Monthly Investment (₹)</Label>
                <Input
                  id="monthlyInvestment"
                  type="number"
                  placeholder="e.g. 1000"
                  defaultValue={1000}
                  className="bg-white dark:bg-zinc-800"
                  onChange={(e) => setMonthlyInvestment(+e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="space-y-2 w-full">
                <Label htmlFor="rate">CAGR (%)</Label>
                <div className="flex items-center justify-center gap-2">
                  <Slider
                    defaultValue={[12]}
                    max={100}
                    step={1}
                    value={rate}
                    onValueChange={setRate}
                  />
                  <p className="font-semibold">{rate[0]}%</p>
                </div>
              </div>

              <div className="space-y-2 w-full">
                <Label htmlFor="years">Duration (Years)</Label>
                <div className="flex items-center justify-center gap-2">
                  <Slider
                    defaultValue={[10]}
                    max={100}
                    step={1}
                    value={years}
                    onValueChange={setYears}
                  />
                  <p className="font-semibold">{years[0]}y</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {returns !== null && (
          <>
            <Separator className="my-4" />
            <div className="bg-slate-200 p-8 rounded-2xl space-y-6 w-full">
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-slate-700 dark:text-slate-400">
                  Results
                </h3>
                <div className="grid sm:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300 text-base font-medium">
                  <p>
                    <span className="font-semibold">Initial Investment:</span> ₹
                    {initialInvestment}
                  </p>
                  <p>
                    <span className="font-semibold">Monthly Investment:</span> ₹
                    {monthlyInvestment * 12 * years[0]}
                  </p>
                  <p>
                    <span className="font-semibold">Duration:</span> {years[0]}{" "}
                    year{years[0] > 1 ? "s" : ""}
                  </p>
                  <p>
                    <span className="font-semibold">CAGR:</span> {rate[0]}%
                  </p>
                  <p>
                    <span className="font-semibold">Total Investment:</span> ₹
                    {initialInvestment + monthlyInvestment * years[0] * 12}
                  </p>
                  <p>
                    <span className="font-semibold">Total Returns:</span> ₹
                    {returns.toFixed(2)}
                  </p>
                  <p>
                    <span className="font-semibold">Actual Returns:</span> ₹
                    {(
                      returns -
                      (initialInvestment + monthlyInvestment * years[0] * 12)
                    ).toFixed(2)}
                  </p>
                </div>
              </div>

            </div>
            {/* Chart */}
            <div className="w-full mt-8 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ left: 40, right: 20, top: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="year"
                    label={{ value: "Years", position: "insideBottom", offset: -5 }}
                  />
                  <YAxis tickFormatter={(v) => `₹${v}`} />
                  <Tooltip formatter={(v: number) => `₹${v.toFixed(2)}`} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    name="Total Value"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="investment"
                    stroke="#ef4444"
                    strokeWidth={3}
                    name="Investment"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
