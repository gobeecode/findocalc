"use client";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRightIcon, Code2Icon, UserIcon } from "lucide-react";
import { Github, Twitter, Linkedin } from "lucide-react";
import Image from "next/image";

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
      <div className=" flex flex-col items-center justify-center gap-2 bg-sky-700 text-white w-full mb-10">
      <div className=" w-full sm:w-1/2 md:w-1/3 lg:w-1/4 text-center flex flex-col items-center justify-center gap-2 px-5 py-10">
        <div className="flex flex-col items-center justify-center gap-1">
        <Image src={"./favicon.svg"} alt="Logo image" width={100} height={100} /> 
        <h1 className="text-3xl sm:text-4xl font-bold text-center">
        Zapcalc  
        </h1>
        </div>
        <p className="text-lg text-center">Opensource personal finance calculators developed by <a
          href="http://linkedin.com/in/gobeecode"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold relative group px-0 py-1"
        >
          Gopalakrishnan (@gobeecode).
          <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-yellow-300 transition-all duration-300 ease-in-out group-hover:w-full"></span>
        </a>
        </p>
        <div className="flex items-center justify-center gap-4 mt-2">
          <a href="https://linkedin.com/in/gobeecode" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <Linkedin className="w-8 h-8 " />
          </a>
          <a href="https://github.com/gobeecode" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <Github className="w-8 h-8 " />
          </a>
          <a href="https://twitter.com/gobeecode" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <Twitter className="w-8 h-8" />
          </a>
        </div>
        <p className="text-white">If you like my work, consider supporting me!</p>
        <div className="flex items-center justify-center gap-2">
        <a href="https://razorpay.me/@gobeecode" target="_blank" className="mt-2 ">
          <Button className="cursor-pointer bg-yellow-300 text-gray-800 hover:bg-yellow-400"><Code2Icon /> Donate </Button>
        </a>
        <a href="https://gopalakrishnan.vercel.app" target="_blank" className="mt-2">
          <Button className="cursor-pointer border-2 border-yellow-300 text-yellow-300 bg-transparent hover:bg-transparent"><UserIcon /> About me</Button>
        </a>
        </div>
      </div>
      </div>

      <div className="mx-auto px-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {calculators.map((calc, idx) => (
            <Card
              key={idx}
              className="border border-gray-200 dark:border-gray-700 rounded-xl"
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
