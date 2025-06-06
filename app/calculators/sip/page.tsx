
"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Slider } from "@/components/ui/slider";

export default function SIPCalculator() {
  const router = useRouter();

  const [initialInvestment, setIntialInvestment] = useState(0);
  const [monthlyInvestment, setMonthlyInvestment] = useState(0);
  const [rate, setRate] = useState([12]);
  const [years, setYears] = useState([20]);
  const [returns, setReturns] = useState<number | null>(null);

  function calculate(rate: number, years: number, monthlyContribution: number, initialInvestment: number) {
    const monthlyRate = rate / 100 / 12;
    const months = years * 12;
    // FV = -(PMT * ((1 + r)^n - 1) / r) - PV * (1 + r)^n
    const fv = -(monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)) - initialInvestment * Math.pow(1 + monthlyRate, months);
    setReturns(-fv);
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full lg:p-14 p-2">
      <div className="w-full md:w-1/2">
        <Card className="w-full p-8">
        <div className="flex items-center justify-between">
          <Button onClick={() => router.back()} className="rounded-full w-10 h-10 cursor-pointer"><ArrowLeft /></Button>
          <h2 className="text-2xl font-bold text-center">
            SIP Calculator
          </h2>
          <div></div>
          </div>

          <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">

            <div className="space-y-2 w-full">
              <Label htmlFor="initialInvestment">Initial Investment (₹)</Label>
              <Input
                id="initialInvestment"
                type="number"
                placeholder="e.g. 100000"
                className="bg-white dark:bg-zinc-800"
                onChange={(e) => setIntialInvestment(+e.target.value)}
              />
            </div>
            <div className="space-y-2 w-full">
              <Label htmlFor="monthlyInvestment">Monthly Investment (₹)</Label>
              <Input
                id="monthlyInvestment"
                type="number"
                placeholder="e.g. 100000"
                className="bg-white dark:bg-zinc-800"
                onChange={(e) => setMonthlyInvestment(+e.target.value)}
              />
            </div>
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
            onClick={() => calculate(rate[0], years[0], monthlyInvestment, initialInvestment)}
            className="w-full font-semibold cursor-pointer my-4"
          >
            Calculate
          </Button>
        </Card>

        {returns !== null && monthlyInvestment !== null && (
          <>
            <Separator className="my-4" />
            <div className="bg-slate-200 p-8 rounded-2xl space-y-3  w-full">
              <h3 className="text-xl font-bold text-slate-700 dark:text-slate-400">
                Results
              </h3>
              <div className="grid sm:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300 text-base font-medium">
                <p>
                  <span className="font-semibold">Initial Investment:</span>{" "}
                  ₹{initialInvestment}
                </p>
                <p>
                  <span className="font-semibold">Monthly Investment:</span>{" "}
                  ₹{monthlyInvestment}
                </p>
                <p>
                  <span className="font-semibold">Duration:</span> {years}{" "}
                  year{years[0] > 1 ? "s" : ""}
                </p>
                <p>
                  <span className="font-semibold">Rate:</span> {rate}{"% "}
                </p>
                <p>
                  <span className="font-semibold">Total Investment:</span>{" "}
                  ₹{initialInvestment + monthlyInvestment * years[0] * 12}
                </p>
                <p>
                  <span className="font-semibold">Total Returns:</span>{" "}
                  ₹{returns.toFixed(2)}
                </p>
                <p>
                  <span className="font-semibold">Actual Returns:</span>{" "}
                  ₹{(returns - (initialInvestment + monthlyInvestment * years[0] * 12)).toFixed(2)}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
