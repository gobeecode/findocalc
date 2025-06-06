"use client";
import { useEffect, useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Slider } from "@/components/ui/slider";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function CAGRCalculator() {
  const router = useRouter();

  const [initialValue, setInitialValue] = useState(10000);
  const [finalValue, setFinalValue] = useState(20000);
  const [years, setYears] = useState([5]);
  const [cagr, setCagr] = useState<number | null>(null);

  const calculateCAGR = () => {
    if (initialValue > 0 && finalValue > 0 && years[0] > 0) {
      const result = (Math.pow(finalValue / initialValue, 1 / years[0]) - 1) * 100;
      setCagr(result);
    }
  };

  useEffect(() => {
    calculateCAGR();
  }, [initialValue, finalValue, years]);

  const growthData = useMemo(() => {
    if (cagr === null) return [];

    const data = [];
    for (let i = 0; i <= years[0]; i++) {
      const value = initialValue * Math.pow(1 + cagr / 100, i);
      data.push({
        year: i,
        value: Number(value.toFixed(2)),
      });
    }
    return data;
  }, [cagr, initialValue, years]);

  return (
    <div className="flex flex-col items-center justify-start w-full h-full lg:p-14 p-2">
      <div className="w-full md:w-1/2">
        <Card className="w-full p-8">
          <div className="flex items-center justify-start gap-3">
            <Button onClick={() => router.back()} className="rounded-full w-10 h-10 cursor-pointer bg-sky-700 hover:bg-sky-800">
              <ArrowLeft />
            </Button>
            <h2 className="text-2xl font-bold text-center text-sky-700">CAGR Calculator</h2>
          </div>

          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Initial Investment (₹)</Label>
              <Input
                type="number"
                defaultValue={initialValue}
                className="bg-white dark:bg-zinc-800"
                onChange={(e) => setInitialValue(+e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Final Value (₹)</Label>
              <Input
                type="number"
                defaultValue={finalValue}
                className="bg-white dark:bg-zinc-800"
                onChange={(e) => setFinalValue(+e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Duration (Years)</Label>
              <div className="flex items-center justify-center gap-2">
                <Slider
                  value={years}
                  max={100}
                  step={1}
                  onValueChange={(val) => setYears(val)}
                />
                <p className="font-semibold">{years[0]}y</p>
              </div>
            </div>
          </div>
        </Card>

        {cagr !== null && (
          <>
            <Separator className="my-4" />
            <div className="bg-slate-200 p-8 rounded-2xl space-y-3 w-full">
              <h3 className="text-xl font-bold text-slate-700 dark:text-slate-400">
                Results
              </h3>
              <div className="grid sm:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300 text-base font-medium">
                <p>
                  <span className="font-semibold">Initial Investment:</span> ₹{initialValue}
                </p>
                <p>
                  <span className="font-semibold">Final Value:</span> ₹{finalValue}
                </p>
                <p>
                  <span className="font-semibold">Duration:</span> {years[0]} year{years[0] > 1 ? "s" : ""}
                </p>
                <p>
                  <span className="font-semibold">CAGR:</span> {cagr.toFixed(2)}%
                </p>
              </div>
            </div>

            {/* Chart */}
            <div className="w-full mt-8 h-80">
              <ResponsiveContainer>
                <LineChart
                  data={growthData}
                  margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="year"
                    label={{ value: "Year", position: "insideBottom", offset: -5 }}
                    allowDecimals={false}
                  />
                  <YAxis
                    tickFormatter={(val) => `₹${val.toLocaleString()}`}
                  />
                  <Tooltip
                    formatter={(value: number) => `₹${value.toFixed(2)}`}
                    labelFormatter={(label) => `Year ${label}`}
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    name="Investment Value"
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
