"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Slider } from "@/components/ui/slider";

export default function InflationCalculator() {

  const router = useRouter();

  const [amount, setAmount] = useState(0);
  const [rate, setRate] = useState([6]);
  const [years, setYears] = useState([10]);
  const [result, setResult] = useState<number | null>(null);
  const [difference, setDifference] = useState<number | null>(null);

  const calculate = () => {
    const inflationAdjusted = amount / Math.pow(1 + rate[0] / 100, years[0]);
    setResult(inflationAdjusted);
    setDifference(inflationAdjusted - amount);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full lg:p-14 p-2">
      <div className="w-full md:w-1/2">
        <Card className="w-full p-8">
        <div className="flex items-center justify-between">
          <Button onClick={() => router.back()} className="rounded-full w-10 h-10 cursor-pointer"><ArrowLeft /></Button>
          <h2 className="text-2xl font-bold text-center">
            Value Depreciation Calculator
          </h2>
          <div></div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Current Value (₹)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="e.g. 100000"
                className="bg-white dark:bg-zinc-800"
                onChange={(e) => setAmount(+e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="space-y-2 w-full">
                <Label htmlFor="rate">Inflation Rate (%)</Label>
                <div className="flex items-center justify-center gap-2">
                <Slider defaultValue={[12]} max={100} step={1}  value={rate} onValueChange={(val) => setRate(val)}/>
                  <p className="font-semibold">{rate}%</p>
                  </div>


              </div>
              <div className="space-y-2 w-full">
                <Label htmlFor="years">Duration (Years)</Label>
                <div className="flex items-center justify-center gap-2">
                <Slider defaultValue={[10]} max={100} step={1}  value={years} onValueChange={(val) => setYears(val)}/>
                  <p className="font-semibold">{years}y</p>
                  </div>

              </div>
            </div>
          </div>

          <Button
            onClick={calculate}
            className="w-full font-semibold cursor-pointer my-4"
          >
            Calculate
          </Button>
        </Card>

        {result !== null && difference !== null && (
          <>
            <Separator className="my-4" />
            <div className="bg-slate-200 p-8 rounded-2xl space-y-3  w-full">
              <h3 className="text-xl font-bold text-slate-700 dark:text-slate-400">
                Results
              </h3>
              <div className="grid sm:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300 text-base font-medium">
                <p>
                  <span className="font-semibold">Current Value:</span>{" "}
                  ₹{amount}
                </p>
                <p>
                  <span className="font-semibold">Future Value:</span>{" "}
                  ₹{result.toFixed(2)}
                </p>
                <p>
                  <span className="font-semibold">Inflation Rate:</span> {rate}{"% "}  
                </p>
                <p>
                  <span className="font-semibold">Duration:</span> {years}{" "}
                  year{years[0] > 1 ? "s" : ""}
                </p>
                <p>
                  <span className="font-semibold">Difference:</span>{" "}
                  ₹{difference.toFixed(2)}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
