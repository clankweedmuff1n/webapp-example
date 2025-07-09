// src/pages/Dashboard.tsx
import { useState } from 'react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

// Интерфейс для результатов расчета
interface ROIResult {
    totalInvestment: number;
    dailyIncome: number;
    daysToROI: number;
    chartData: { name: string; value: number; color: string }[];
}

// Цвета для секторов диаграммы
const COLORS = ['#0088FE', '#00C49F'];

export default function Dashboard() {
    const [formData, setFormData] = useState({
        model: '',
        hashrate: '',
        cost: '',
        delivery: '',
        electricity: '',
        tax: ''
    });

    const [chartData, setChartData] = useState<ROIResult | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const calculateROI = (): ROIResult => {
        const equipmentCost = parseFloat(formData.cost) || 0;
        const deliveryCost = parseFloat(formData.delivery) || 0;
        const totalInvestment = equipmentCost + deliveryCost;
        const dailyIncome = equipmentCost > 0 ? equipmentCost * 0.008 : 0;
        const daysToROI = dailyIncome > 0 ? totalInvestment / dailyIncome : 0;

        // Формируем данные для диаграммы
        const chartData = [
            {
                name: 'Инвестиции',
                value: totalInvestment,
                color: COLORS[0]
            },
            {
                name: 'Ежедневный доход',
                value: dailyIncome,
                color: COLORS[1]
            }
        ];

        return {
            totalInvestment,
            dailyIncome,
            daysToROI: isFinite(daysToROI) ? daysToROI : 0,
            chartData
        };
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const result = calculateROI();
        setChartData(result);
    };

    // Кастомный тултип для диаграммы
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 border rounded-md shadow-lg">
                    <p className="font-medium">{payload[0].name}</p>
                    <p>${payload[0].value.toFixed(2)}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">
                            Калькулятор окупаемости ASIC майнера
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Модель ASIC */}
                                <div className="space-y-2">
                                    <Label htmlFor="model">Модель ASIC</Label>
                                    <Input
                                        id="model"
                                        type="text"
                                        placeholder="Например: Antminer S19 Pro"
                                        value={formData.model}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                {/* Хешрейт */}
                                <div className="space-y-2">
                                    <Label htmlFor="hashrate">Хешрейт (TH/s)</Label>
                                    <Input
                                        id="hashrate"
                                        type="number"
                                        placeholder="Например: 110"
                                        value={formData.hashrate}
                                        onChange={handleChange}
                                        required
                                        min="1"
                                    />
                                </div>

                                {/* Стоимость оборудования */}
                                <div className="space-y-2">
                                    <Label htmlFor="cost">Стоимость ASIC ($)</Label>
                                    <Input
                                        id="cost"
                                        type="number"
                                        placeholder="Например: 2500"
                                        value={formData.cost}
                                        onChange={handleChange}
                                        required
                                        min="1"
                                    />
                                </div>

                                {/* Расходы на доставку */}
                                <div className="space-y-2">
                                    <Label htmlFor="delivery">Расходы на доставку/подключение ($)</Label>
                                    <Input
                                        id="delivery"
                                        type="number"
                                        placeholder="Например: 300"
                                        value={formData.delivery}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                    />
                                </div>

                                {/* Цена на электричество */}
                                <div className="space-y-2">
                                    <Label htmlFor="electricity">Цена электричества ($/кВт·ч)</Label>
                                    <Input
                                        id="electricity"
                                        type="number"
                                        step="0.01"
                                        placeholder="Например: 0.12"
                                        value={formData.electricity}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                    />
                                </div>

                                {/* Налог */}
                                <div className="space-y-2">
                                    <Label htmlFor="tax">Налог (%)</Label>
                                    <Input
                                        id="tax"
                                        type="number"
                                        placeholder="Например: 15"
                                        value={formData.tax}
                                        onChange={handleChange}
                                        min="0"
                                        max="100"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                                    Рассчитать окупаемость
                                </Button>
                            </div>
                        </form>

                        {chartData && (
                            <>
                                <Separator className="my-8" />

                                <div className="mt-8">
                                    <h2 className="text-xl font-bold mb-6 text-center">
                                        Соотношение расходов и доходов
                                    </h2>

                                    <div className="h-80 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={chartData.chartData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    outerRadius={100}
                                                    innerRadius={60}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                    nameKey="name"
                                                    label={({ name, percent }) =>
                                                        `${name}: ${(percent! * 100).toFixed(0)}%`
                                                    }
                                                >
                                                    {chartData.chartData.map((entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={entry.color}
                                                        />
                                                    ))}
                                                </Pie>
                                                <Tooltip content={<CustomTooltip />} />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>

                                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <Card>
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-sm font-medium">Общие инвестиции</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold">${chartData.totalInvestment.toFixed(2)}</div>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-sm font-medium">Доход в день</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold">${chartData.dailyIncome.toFixed(2)}</div>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-sm font-medium">Дней до окупаемости</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold">{Math.ceil(chartData.daysToROI)}</div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}