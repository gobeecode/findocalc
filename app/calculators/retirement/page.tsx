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
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

export default function RetirementCalculator() {
  const router = useRouter();

  const [currentAge, setCurrentAge] = useState([30]);
  const [retirementAge, setRetirementAge] = useState([60]);
  const [monthlyExpense, setMonthlyExpense] = useState(30000);
  const [inflationRate, setInflationRate] = useState([6]);
  const [postRetirementReturnRate, setPostRetirementReturnRate] = useState([5]); // nominal return

  const [futureMonthlyExpense, setFutureMonthlyExpense] = useState<number | null>(null);
  const [requiredCorpus, setRequiredCorpus] = useState<number | null>(null);
  const [yearsCorpusLasts, setYearsCorpusLasts] = useState<number | null>(null);
  const [expenseGrowthData, setExpenseGrowthData] = useState<any[]>([]);
  const [corpusDrawdownData, setCorpusDrawdownData] = useState<any[]>([]);

  const calculate = () => {
    const yearsToRetire = retirementAge[0] - currentAge[0];
    const yearsInRetirement = 85 - retirementAge[0];
    const inflation = inflationRate[0] / 100;
    const nominalReturn = postRetirementReturnRate[0] / 100;
    const realReturn = (1 + nominalReturn) / (1 + inflation) - 1;

    // Project future monthly expense
    const inflatedMonthlyExpense = monthlyExpense * Math.pow(1 + inflation, yearsToRetire);
    const annualExpense = inflatedMonthlyExpense * 12;

    const corpus = annualExpense * ((1 - Math.pow(1 + realReturn, -yearsInRetirement)) / realReturn);

    setFutureMonthlyExpense(inflatedMonthlyExpense);
    setRequiredCorpus(corpus);

    // Build expense growth data
    const expenseData = [];
    for (let i = 0; i <= yearsToRetire; i++) {
      const year = currentAge[0] + i;
      const monthly = monthlyExpense * Math.pow(1 + inflation, i);
      expenseData.push({ age: year, "Monthly Expense (₹)": Math.round(monthly) });
    }
    setExpenseGrowthData(expenseData);

    // Corpus drawdown simulation
    const drawdownData = [];
    let balance = corpus;
    for (let i = 0; i <= yearsInRetirement; i++) {
      const year = retirementAge[0] + i;
      const expense = annualExpense * Math.pow(1 + inflation, i); // ✅ Expense increases each year
      const interest = balance * nominalReturn;
      balance = balance + interest - expense;

      drawdownData.push({
        age: year,
        "Corpus Balance (₹)": Math.max(balance, 0),
        "Annual Expense (₹)": Math.round(expense),
      });

      if (balance <= 0) break;
    }
    setCorpusDrawdownData(drawdownData);

    if (annualExpense > corpus * nominalReturn) {
      const years =
        Math.log(annualExpense / (annualExpense - corpus * nominalReturn)) /
        Math.log(1 + nominalReturn);
      setYearsCorpusLasts(parseFloat(years.toFixed(1)));
    } else {
      setYearsCorpusLasts(Infinity);
    }
  };


  useEffect(() => {
    calculate();
  }, [currentAge, retirementAge, monthlyExpense, inflationRate, postRetirementReturnRate]);


  return (
    <div className="flex flex-col items-center justify-start w-full h-full lg:p-14 p-2">
      <div className="w-full md:w-1/2">
        <Card className="w-full p-8">
          <div className="flex items-center justify-between">
            <Button onClick={() => router.back()} className="rounded-full w-10 h-10 cursor-pointer">
              <ArrowLeft />
            </Button>
            <h2 className="text-2xl font-bold text-center">Retirement Calculator</h2>
            <div></div>
          </div>

          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Current Monthly Expense (₹)</Label>
              <Input
                type="number"
                defaultValue={monthlyExpense}
                className="bg-white dark:bg-zinc-800"
                onChange={(e) => setMonthlyExpense(+e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="space-y-2 w-full">
                <Label>Current Age</Label>
                <div className="flex items-center justify-center gap-2">
                  <Slider value={currentAge} max={100} step={1} onValueChange={(val) => setCurrentAge(val)} />
                  <p className="font-semibold">{currentAge[0]}y</p>
                </div>
              </div>

              <div className="space-y-2 w-full">
                <Label>Retirement Age</Label>
                <div className="flex items-center justify-center gap-2">
                  <Slider value={retirementAge} max={100} step={1} onValueChange={(val) => setRetirementAge(val)} />
                  <p className="font-semibold">{retirementAge[0]}y</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">

              <div className="space-y-2 w-full">
                <Label>Expected Inflation Rate (%)</Label>
                <div className="flex items-center justify-center gap-2">
                  <Slider value={inflationRate} max={50} min={0.5} step={0.5} onValueChange={(val) => setInflationRate(val)} />
                  <p className="font-semibold">{inflationRate[0]}%</p>
                </div>
              </div>

              <div className="space-y-2 w-full">
                <Label>Post Retirement Return Rate (%)</Label>
                <div className="flex items-center justify-center gap-2">
                  <Slider value={postRetirementReturnRate} max={50} min={0.5} step={0.5} onValueChange={(val) => setPostRetirementReturnRate(val)} />
                  <p className="font-semibold">{postRetirementReturnRate[0]}%</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {requiredCorpus !== null && futureMonthlyExpense !== null && (
          <>
            <Separator className="my-4" />
            <div className="bg-slate-200 p-8 rounded-2xl space-y-3 w-full">
              <h3 className="text-xl font-bold text-slate-700 dark:text-slate-400">Results</h3>
              <div className="grid sm:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300 text-base font-medium">
                <p>
                  <span className="font-semibold">Future Monthly Expense:</span> ₹{futureMonthlyExpense.toFixed(2)}
                </p>
                <p>
                  <span className="font-semibold">Annual Expense at Retirement:</span> ₹{(futureMonthlyExpense * 12).toFixed(0)}
                </p>
                <p>
                  <span className="font-semibold">Required Corpus:</span> ₹{requiredCorpus.toFixed(0)}
                </p>
                <p>
                  <span className="font-semibold">Years Corpus Will Last:</span>{" "}
                  {yearsCorpusLasts === Infinity ? "Forever" : `${yearsCorpusLasts} years`}
                </p>
              </div>
            </div>
            {expenseGrowthData.length > 0 && (
            <div className="w-full mt-8 h-80">
                <h3 className="text-xl font-bold mb-2">Future Monthly Expense Growth</h3>
                <ResponsiveContainer>
                  <LineChart data={expenseGrowthData} margin={{ left: 40, right: 20, top: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Monthly Expense (₹)" stroke="#ef4444" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {corpusDrawdownData.length > 0 && (
            <div className="w-full mt-8 h-80">
                <h3 className="text-xl font-bold mb-2">Corpus vs Expense During Retirement</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={corpusDrawdownData} margin={{ left: 40, right: 20, top: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Corpus Balance (₹)" stroke="#3b82f6" strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="Annual Expense (₹)" stroke="#ef4444" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
}
