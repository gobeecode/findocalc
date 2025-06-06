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

export default function EMICalculator() {
  const router = useRouter();

  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState([8]);
  const [loanTenure, setLoanTenure] = useState([5]); // in years

  const [emi, setEmi] = useState<number | null>(null);
  const [totalInterest, setTotalInterest] = useState<number | null>(null);
  const [totalPayment, setTotalPayment] = useState<number | null>(null);

  // Calculate EMI
  const calculateEMI = () => {
    const P = loanAmount;
    const r = interestRate[0] / 12 / 100;
    const n = loanTenure[0] * 12;

    const monthlyEMI = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalAmt = monthlyEMI * n;
    const interestAmt = totalAmt - P;

    setEmi(monthlyEMI);
    setTotalInterest(interestAmt);
    setTotalPayment(totalAmt);
  };

  useEffect(() => {
    calculateEMI();
  }, [loanAmount, interestRate, loanTenure]);

  // Prepare amortization data for chart: month, principal paid, interest paid
  const amortizationData = useMemo(() => {
    if (emi === null) return [];

    const P = loanAmount;
    const r = interestRate[0] / 12 / 100;
    const n = loanTenure[0] * 12;

    let balance = P;
    let data = [];

    for (let month = 1; month <= n; month++) {
      const interestForMonth = balance * r;
      const principalForMonth = emi - interestForMonth;
      balance -= principalForMonth;

      data.push({
        month,
        Principal: Number(principalForMonth.toFixed(2)),
        Interest: Number(interestForMonth.toFixed(2)),
      });
    }

    return data;
  }, [emi, loanAmount, interestRate, loanTenure]);

  return (
    <div className="flex flex-col items-center justify-start w-full h-full lg:p-14 p-2">
      <div className="w-full md:w-1/2">
        <Card className="w-full p-8">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => router.back()}
              className="rounded-full w-10 h-10 cursor-pointer bg-sky-700 hover:bg-sky-800"
            >
              <ArrowLeft />
            </Button>
            <h2 className="text-2xl font-bold text-center text-sky-700">EMI Calculator</h2>
            <div></div>
          </div>

          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Loan Amount (₹)</Label>
              <Input
                type="number"
                defaultValue={loanAmount}
                className="bg-white dark:bg-zinc-800"
                onChange={(e) => setLoanAmount(+e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="space-y-2 w-full">
                <Label>Interest Rate (%)</Label>
                <div className="flex items-center justify-center gap-2">
                  <Slider
                    value={interestRate}
                    max={50}
                    step={0.5}
                    onValueChange={(val) => setInterestRate(val)}
                  />
                  <p className="font-semibold">{interestRate[0]}%</p>
                </div>
              </div>

              <div className="space-y-2 w-full">
                <Label>Loan Tenure (Years)</Label>
                <div className="flex items-center justify-center gap-2">
                  <Slider
                    value={loanTenure}
                    max={100}
                    step={1}
                    onValueChange={(val) => setLoanTenure(val)}
                  />
                  <p className="font-semibold">{loanTenure[0]}y</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {emi !== null && totalInterest !== null && totalPayment !== null && (
          <>
            <Separator className="my-4" />
            <div className="bg-slate-200 p-8 rounded-2xl space-y-3 w-full">
              <h3 className="text-xl font-bold text-slate-700 dark:text-slate-400">
                Results
              </h3>
              <div className="grid sm:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300 text-base font-medium">
                <p>
                  <span className="font-semibold">Monthly EMI:</span> ₹
                  {emi.toFixed(2)}
                </p>
                <p>
                  <span className="font-semibold">Loan Amount:</span> ₹
                  {loanAmount}
                </p>
                <p>
                  <span className="font-semibold">Interest Rate:</span>{" "}
                  {interestRate[0]}%
                </p>
                <p>
                  <span className="font-semibold">Loan Tenure:</span>{" "}
                  {loanTenure[0]} year{loanTenure[0] > 1 ? "s" : ""}
                </p>
                <p>
                  <span className="font-semibold">Total Interest:</span> ₹
                  {totalInterest.toFixed(2)}
                </p>
                <p>
                  <span className="font-semibold">Total Payment:</span> ₹
                  {totalPayment.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Chart */}
            <div className="w-full mt-8 h-80">
              <ResponsiveContainer>
                <LineChart
                  data={amortizationData}
                  margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    label={{ value: "Month", position: "insideBottom", offset: -5 }}
                    allowDecimals={false}
                  />
                  <YAxis
                    tickFormatter={(val) => `₹${val.toLocaleString()}`}
                  />
                  <Tooltip
                    formatter={(value: number) => `₹${value.toFixed(2)}`}
                    labelFormatter={(label) => `Month ${label}`}
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Line
                    type="monotone"
                    dataKey="Principal"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    name="Principal Paid"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="Interest"
                    stroke="#ef4444"
                    strokeWidth={3}
                    name="Interest Paid"
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
