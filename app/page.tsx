"use client";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { Github, Twitter, Linkedin } from "lucide-react";

const calculators = [
  { title: "Inflation Calculator", description: "See future inflation adjusted value of the current amount", href: "/calculators/inflation" },
  { title: "Value Depreciation Calculator", description: "Loss of purchasing power over time", href: "/calculators/value-depreciation" },
  { title: "SIP Calculator", description: "Plan your mutual fund SIP returns", href: "/calculators/sip" },
  { title: "EMI Calculator", description: "Calculate your monthly loan payments", href: "/calculators/emi" },
  { title: "CAGR Calculator", description: "Compound annual growth rate", href: "/calculators/cagr" },
  { title: "Retirement Calculator", description: "Plan how much you need to retire", href: "/calculators/retirement" },
  { title: "Goal Based Calculator", description: "Goal based investment", href: "/calculators/goal-based" },
];

export default function CalculatorsHome() {
  return (
    <div className="w-full">
      <div className="flex flex-col items-center justify-center gap-2 mb-10 bg-sky-700 py-14 text-white">
        <h1 className="text-3xl sm:text-4xl font-bold text-center">
          Findocalc
        </h1>
        <p className="text-lg text-center">Personal Finance Calculator Collection developed by Gopalakrishnan (@gobeecode)</p>
        <div className="flex gap-4 mt-2">
          <a href="https://github.com/gobeecode" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <Github className="w-10 h-10 " />
          </a>
          <a href="https://twitter.com/gobeecode" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <Twitter className="w-10 h-10" />
          </a>
          <a href="https://linkedin.com/in/gobeecode" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <Linkedin className="w-10 h-10 " />
          </a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {calculators.map((calc, idx) => (
            <Card
              key={idx}
              className="hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700 rounded-xl"
            >
              <CardTitle className="px-6 space-y-2">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {calc.title}
                </h2>
              </CardTitle>
              <CardContent className="px-6 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {calc.description}
                  </p>
                  <Link href={calc.href}>
                    <Button className="mt-2 cursor-pointer p-5 rounded-full bg-sky-700 hover:bg-sky-800">
                      <ArrowRightIcon />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
