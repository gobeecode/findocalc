"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function GoalBasedInvestmentCalculator() {
    const router = useRouter();

    const [goalAmount, setGoalAmount] = useState(1000000);
    const [inflationAdjustedGoalAmount, setInflationAdjustedGoalAmount] = useState(0);
    const [years, setYears] = useState([10]);
    const [expectedReturn, setExpectedReturn] = useState([12]);
    const [investmentType, setInvestmentType] = useState<"sip" | "lumpsum">("sip");

    const [monthlySIP, setMonthlySIP] = useState<number | null>(null);
    const [totalSIPInvestment, setTotalSIPInvestment] = useState<number | null>(null);
    const [lumpSumNeeded, setLumpSumNeeded] = useState<number | null>(null);
    const [chartData, setChartData] = useState<any[]>([]);

    const calculate = () => {
        const r = expectedReturn[0] / 100 / 12; // monthly rate
        const n = years[0] * 12; // total months

        if (investmentType === "sip") {
            const sip = goalAmount * (r / (Math.pow(1 + r, n) - 1));
            setMonthlySIP(Math.round(sip));
            setTotalSIPInvestment(Math.round(sip * n));
            setLumpSumNeeded(null);

            const data = Array.from({ length: years[0] }, (_, i) => {
                const t = (i + 1) * 12;
                const fv = sip * ((Math.pow(1 + r, t) - 1) / r);
                return { year: i + 1, value: Math.round(fv) };
            });
            setChartData(data);

        } else {
            const lump = goalAmount / Math.pow(1 + expectedReturn[0] / 100, years[0]);
            setLumpSumNeeded(Math.round(lump));
            setMonthlySIP(null);
            setTotalSIPInvestment(null);

            const data = Array.from({ length: years[0] }, (_, i) => {
                const fv = lump * Math.pow(1 + expectedReturn[0] / 100, i + 1);
                return { year: i + 1, value: Math.round(fv) };
            });
            setChartData(data);
        }

        const inflationAdjusted = (goalAmount * Math.pow(1 + expectedReturn[0] / 100, years[0]));
        setInflationAdjustedGoalAmount(inflationAdjusted)
    };

    useEffect(() => {
        calculate();
    }, [goalAmount, years, expectedReturn, investmentType]);

    return (
        <div className="flex flex-col items-center justify-start w-full h-full lg:p-14 p-2">
            <div className="w-full md:w-1/2">
                <Card className="w-full p-8">
                    <div className="flex items-center justify-start gap-3">
                        <Button onClick={() => router.back()} className="rounded-full w-10 h-10 cursor-pointer bg-sky-700 hover:bg-sky-800">
                            <ArrowLeft />
                        </Button>
                        <h2 className="text-2xl font-bold text-center text-sky-700">Goal-Based Investment Calculator</h2>
                    </div>

                    <div className="space-y-4 mt-6">
                        <div className="space-y-2">
                            <Label>Goal Amount (₹)</Label>
                            <Input
                                type="number"
                                defaultValue={goalAmount}
                                className="bg-white dark:bg-zinc-800"
                                onChange={(e) => setGoalAmount(+e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Duration</Label>
                            <div className="flex items-center gap-2">
                                <Slider value={years} max={100} min={1} step={1} onValueChange={setYears} />
                                <span className="font-semibold">{years[0]}y</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Expected Return Rate (% p.a.)</Label>
                            <div className="flex items-center gap-2">
                                <Slider value={expectedReturn} max={50} min={1} step={0.5} onValueChange={setExpectedReturn} />
                                <span className="font-semibold">{expectedReturn[0]}%</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Investment Type</Label>
                            <RadioGroup
                                defaultValue="sip"
                                onValueChange={(val) => setInvestmentType(val as "sip" | "lumpsum")}
                                className="flex gap-6 mt-5"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="sip" id="sip" />
                                    <Label htmlFor="sip">Monthly SIP</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="lumpsum" id="lumpsum" />
                                    <Label htmlFor="lumpsum">Lump Sum</Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </div>
                </Card>

                {(monthlySIP !== null || lumpSumNeeded !== null) && (
                    <>
                        <Separator className="my-4" />
                        <div className="bg-slate-200 p-8 rounded-2xl space-y-3 w-full">
                            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-400">Result</h3>
                            <div className="text-lg font-medium text-gray-800 dark:text-gray-200">
                                {monthlySIP !== null && (
                                    <div className="grid sm:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300 text-base font-medium">
                                        <p><span className="font-semibold">Goal:</span> ₹{goalAmount}</p>
                                        <p><span className="font-semibold">Inflation Adjusted Goal:</span> ₹{inflationAdjustedGoalAmount.toFixed(2)}</p>
                                        <p><span className="font-semibold">Duration:</span> {years[0]} years</p>
                                        <p><span className="font-semibold">Monthly Investment:</span> ₹{monthlySIP}</p>
                                        <p><span className="font-semibold">Total SIP Investment:</span> ₹{totalSIPInvestment}</p>
                                    </div>
                                )}
                                {lumpSumNeeded !== null && (
                                    <div className="grid sm:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300 text-base font-medium">
                                        <p><span className="font-semibold">Goal:</span> ₹{goalAmount}</p>
                                        <p><span className="font-semibold">Inflation Adjusted Goal:</span> ₹{inflationAdjustedGoalAmount.toFixed(2)}</p>
                                        <p><span className="font-semibold">Duration:</span> {years[0]} years</p>
                                        <p><span className="font-semibold">Lumpsum Investment:</span> ₹{lumpSumNeeded}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="w-full mt-8 h-80">
                            <ResponsiveContainer>
                                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 40, bottom: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottom', offset: -5 }} />
                                    <YAxis />
                                    <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                                    <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
