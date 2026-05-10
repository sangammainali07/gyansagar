"use client"

import { Card } from "@/components/ui/card";

import { Bar,
 BarChart,
ResponsiveContainer,
XAxis,
YAxis,
Tooltip } from "recharts"


interface ChartProps {
    data:{
        name:string;
        total:number;
    }[]
}

export const Chart = ({ data }: ChartProps) => {

    if (!data || data.length === 0) {
        return (
            <Card className="p-4">
                <div className="w-full h-[350px] flex items-center justify-center">
                    <p className="text-gray-500">No data available</p>
                </div>
            </Card>
        )
    }

    return (
       
        <Card className="p-4">
            <div className="w-full h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                        <XAxis dataKey="name"
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    
                        />
                        <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value)=>`$${value}`}
                        />
                        <Tooltip 
                        contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px", color: "#fff" }}
                        />
                        <Bar dataKey="total" fill="#0369a1" radius={[4,4,0,0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    )
}