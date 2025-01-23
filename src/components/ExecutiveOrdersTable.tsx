import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    flexRender,
    createColumnHelper,
    SortingState,
} from '@tanstack/react-table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip } from 'react-tooltip';
import { useQuery } from '@tanstack/react-query';
import { useToast } from "@/hooks/use-toast";

type Category = 'environment' | 'immigration' | 'energy' | 'technology' | 'infrastructure' | 'economy' | 'foreign policy' | 'other';
type ForecastLevel = 'high' | 'medium' | 'low';

type ExecutiveOrder = {
    id: number;
    title: string;
    link: string;
    tldr: string;
    status: string;
    forecast: string;
    impact: number;
    categories: Category[];
};

const categories: Category[] = [
    'environment',
    'immigration',
    'energy',
    'technology',
    'infrastructure',
    'economy',
    'foreign policy',
    'other'
];

const forecastLevels: ForecastLevel[] = ['high', 'medium', 'low'];
const impactLevels: number[] = [1, 2, 3, 4, 5];

const columnHelper = createColumnHelper<ExecutiveOrder>();

const getForecastColor = (forecast: string) => {
    const forecastValue = parseFloat(forecast.replace('%', ''));
    if (forecastValue >= 80) return 'bg-red-600';
    if (forecastValue >= 40) return 'bg-orange-500';
    return 'bg-green-600';
};

const getForecastLevel = (forecast: string): ForecastLevel => {
    const forecastValue = parseFloat(forecast.replace('%', ''));
    if (forecastValue >= 80) return 'high';
    if (forecastValue >= 40) return 'medium';
    return 'low';
};

const getImpactColor = (impact: number) => {
    const violetShades = ['bg-violet-100', 'bg-violet-200', 'bg-violet-300', 'bg-violet-400', 'bg-violet-500'];
    return violetShades[impact - 1] || 'bg-violet-100';
};

const ExecutiveOrdersTable = () => {
    const navigate = useNavigate();
    const isMobile = useIsMobile();
    const [data, setData] = useState<ExecutiveOrder[]>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
    const [selectedForecast, setSelectedForecast] = useState<ForecastLevel | 'all'>('all');
    const [selectedImpact, setSelectedImpact] = useState<number | 'all'>('all');

    useEffect(() => {
        fetch('/data.json')
            .then(response => response.json())
            .then(data => setData(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const handleRowClick = (order: ExecutiveOrder) => {
        if (isMobile) {
            navigate(`/executive-order/${order.id}`, { state: { order } });
        }
    };

    const columns = React.useMemo(() => [
        columnHelper.accessor('title', {
            header: 'Executive Orders',
            cell: info => (
                <div className="space-y-2">
                    {isMobile ? (
                        <span className="font-medium text-blue-600 block text-center">{info.getValue()}</span>
                    ) : (
                        <>
                            <a
                                href={info.row.original.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-blue-600 hover:text-blue-800"
                            >
                                {info.getValue()}
                            </a>
                            <div className="flex flex-wrap gap-2">
                                {info.row.original.categories.map((category) => (
                                    <span
                                        key={category}
                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                    >
                                        {category}
                                    </span>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            ),
        }),
        columnHelper.accessor('tldr', {
            header: 'Summary',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('status', {
            header: 'Implementation Status',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('forecast', {
            header: ({ column }) => (
                <div className="flex items-center gap-2">
                    <span>Litigation Forecast</span>
                    <span
                        data-tooltip-id="forecast-tooltip"
                        className="text-sm text-gray-500 cursor-help"
                    >
                        ⓘ
                    </span>
                    {column.getIsSorted() === 'asc' && <span className="text-sm">↑</span>}
                    {column.getIsSorted() === 'desc' && <span className="text-sm">↓</span>}
                </div>
            ),
            cell: info => (
                <div className={`p-2 rounded ${getForecastColor(info.getValue())}`}>
                    {info.getValue()}
                </div>
            ),
        }),
        columnHelper.accessor('impact', {
            header: ({ column }) => (
                <div className="flex items-center gap-2">
                    <span>Social Impact</span>
                    <span
                        data-tooltip-id="impact-tooltip"
                        className="text-sm text-gray-500 cursor-help"
                    >
                        ⓘ
                    </span>
                    {column.getIsSorted() === 'asc' && <span className="text-sm">↑</span>}
                    {column.getIsSorted() === 'desc' && <span className="text-sm">↓</span>}
                </div>
            ),
            cell: info => (
                <div className={`p-2 rounded ${getImpactColor(info.getValue())}`}>
                    {info.getValue()}
                </div>
            ),
        }),
    ], [isMobile]);

    const filteredData = React.useMemo(() => {
        return data.filter(order => {
            const categoryMatch = selectedCategory === 'all' || order.categories.includes(selectedCategory as Category);
            const forecastMatch = selectedForecast === 'all' || getForecastLevel(order.forecast) === selectedForecast;
            const impactMatch = selectedImpact === 'all' || order.impact === selectedImpact;
            return categoryMatch && forecastMatch && impactMatch;
        });
    }, [data, selectedCategory, selectedForecast, selectedImpact]);

    const table = useReactTable({
        data: filteredData,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    return (
        <div className="space-y-4">
            <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 9999 }}>
                <Tooltip
                    id="forecast-tooltip"
                    place="top"
                    className="max-w-[300px] bg-white border border-gray-200 shadow-lg rounded-lg p-4"
                    style={{ 
                        position: 'absolute',
                        pointerEvents: 'auto'
                    }}
                >
                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg">Forecast Key</h3>
                        <p><span className="bg-green-600 px-2 py-1 rounded text-white">0-40%</span>: Not likely to face litigation</p>
                        <p><span className="bg-orange-500 px-2 py-1 rounded text-white">40-80%</span>: Likely to face mild litigation</p>
                        <p><span className="bg-red-600 px-2 py-1 rounded text-white">80-100%</span>: Likely to face extreme litigation</p>
                    </div>
                </Tooltip>

                <Tooltip
                    id="impact-tooltip"
                    place="top"
                    className="max-w-[300px] bg-white border border-gray-200 shadow-lg rounded-lg p-4"
                    style={{ 
                        position: 'absolute',
                        pointerEvents: 'auto'
                    }}
                >
                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg">Impact Key</h3>
                        <p><span className="bg-violet-100 px-2 py-1 rounded">1</span>: Light Violet (Low Impact)</p>
                        <p><span className="bg-violet-300 px-2 py-1 rounded">3</span>: Medium Violet (Moderate Impact)</p>
                        <p><span className="bg-violet-500 px-2 py-1 rounded">5</span>: Dark Violet (High Impact)</p>
                    </div>
                </Tooltip>
            </div>

            <div className="flex justify-center gap-4 flex-wrap -mt-8">
                <div className="w-48">
                    <Select value={selectedCategory} onValueChange={(value: Category | 'all') => setSelectedCategory(value)}>
                        <SelectTrigger className="w-full text-left">
                            <SelectValue placeholder="Filter by Category" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border shadow-lg">
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                    {category.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="w-48">
                    <Select value={selectedForecast} onValueChange={(value: ForecastLevel | 'all') => setSelectedForecast(value)}>
                        <SelectTrigger className="w-full text-left">
                            <SelectValue placeholder="Filter by Forecast" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border shadow-lg">
                            <SelectItem value="all">All litigation forecast levels</SelectItem>
                            {forecastLevels.map((level) => (
                                <SelectItem key={level} value={level}>
                                    {level.charAt(0).toUpperCase() + level.slice(1)} Forecast
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="w-48">
                    <Select value={selectedImpact.toString()} onValueChange={(value) => setSelectedImpact(value === 'all' ? 'all' : parseInt(value))}>
                        <SelectTrigger className="w-full text-left">
                            <SelectValue placeholder="Filter by Impact" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border shadow-lg">
                            <SelectItem value="all">All Impact Levels</SelectItem>
                            {impactLevels.map((level) => (
                                <SelectItem key={level} value={level.toString()}>
                                    Impact Level {level}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="rounded-md border">
                <table className="w-full">
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id} className="border-b bg-muted/50">
                                {headerGroup.headers.map(header => (
                                    <th
                                        key={header.id}
                                        onClick={header.column.getToggleSortingHandler()}
                                        className={`h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer hover:bg-muted/70 ${
                                            isMobile && header.id !== 'title' ? 'hidden' : ''
                                        }`}
                                    >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map(row => (
                            <tr 
                                key={row.id} 
                                className="border-b hover:bg-muted/50 cursor-pointer"
                                onClick={() => handleRowClick(row.original)}
                            >
                                {row.getVisibleCells().map(cell => (
                                    <td 
                                        key={cell.id} 
                                        className={`p-4 ${
                                            isMobile && cell.column.id !== 'title' ? 'hidden' : ''
                                        }`}
                                    >
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ExecutiveOrdersTable;
