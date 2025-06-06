"use client";
import { useEffect, useState } from "react";
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
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function InflationCalculator() {
  const router = useRouter();

  const [amount, setAmount] = useState(1000);
  const [rate, setRate] = useState([6]);
  const [years, setYears] = useState([10]);
  const [result, setResult] = useState<number | null>(null);
  const [difference, setDifference] = useState<number | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);

  const calculate = () => {
    const futurePrice = amount * Math.pow(1 + rate[0] / 100, years[0]);
    setResult(futurePrice);
    setDifference(futurePrice - amount);

    const data = [];
    for (let i = 0; i <= years[0]; i++) {
      const value = amount * Math.pow(1 + rate[0] / 100, i);
      data.push({ year: i, price: parseFloat(value.toFixed(2)) });
    }
    setChartData(data);
  };

  useEffect(() => {
    calculate();
  }, [amount, rate, years]);

  return (
    <div className="flex flex-col items-center justify-start w-full h-full lg:p-14 p-2">
      <div className="w-full md:w-1/2">
        <Card className="w-full p-8">
          <div className="flex items-center justify-start gap-3">
            <Button onClick={() => router.back()} className="rounded-full w-10 h-10 cursor-pointer bg-sky-700 hover:bg-sky-800">
              <ArrowLeft />
            </Button>
            <h2 className="text-2xl font-bold text-center">Inflation Calculator</h2>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Current Price (₹)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="e.g. 1000"
                defaultValue={1000}
                className="bg-white dark:bg-zinc-800"
                onChange={(e) => setAmount(+e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="space-y-2 w-full">
                <Label htmlFor="rate">Inflation Rate (%)</Label>
                <div className="flex items-center justify-center gap-2">
                  <Slider value={rate} max={50} step={0.5} onValueChange={setRate} />
                  <p className="font-semibold">{rate[0]}%</p>
                </div>
              </div>
              <div className="space-y-2 w-full">
                <Label htmlFor="years">Duration (Years)</Label>
                <div className="flex items-center justify-center gap-2">
                  <Slider value={years} max={100} step={1} onValueChange={setYears} />
                  <p className="font-semibold">{years[0]}y</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {result !== null && difference !== null && (
          <>
            <Separator className="my-4" />
            <div className="bg-slate-200 p-8 rounded-2xl space-y-6 w-full">
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-slate-700 dark:text-slate-400">Results</h3>
                <div className="grid sm:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300 text-base font-medium">
                  <p><span className="font-semibold">Current Price:</span> ₹{amount}</p>
                  <p><span className="font-semibold">Future Price:</span> ₹{result.toFixed(2)}</p>
                  <p><span className="font-semibold">Inflation Rate:</span> {rate[0]}%</p>
                  <p><span className="font-semibold">Duration:</span> {years[0]} year{years[0] > 1 ? "s" : ""}</p>
                  <p><span className="font-semibold">Difference:</span> ₹{difference.toFixed(2)}</p>
                </div>
              </div>

            </div>
            {/* Chart */}
            <div className="w-full mt-8 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" label={{ value: "Years", position: "insideBottom", offset: -5 }} />
                  <YAxis dataKey="price" tickFormatter={(value) => `₹${value}`} />
                  <Tooltip formatter={(value: number) => `₹${value.toFixed(2)}`} />
                  <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={3} dot={false}/>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>

        )}
      </div>
    </div>
  );
}
