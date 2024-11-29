import React, { useState } from 'react';
import { format } from 'date-fns';

export function ReportGenerator() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [format, setFormat] = useState<'csv' | 'json'>('csv');
    const [isGenerating, setIsGenerating] = useState(false);

    const generateReport = async () => {
        try {
            setIsGenerating(true);
            const queryParams = new URLSearchParams({
                startDate,
                endDate,
                format,
            });

            const response = await fetch(
                `/api/admin/reports?${queryParams.toString()}`
            );

            if (!response.ok) {
                throw new Error('Failed to generate report');
            }

            if (format === 'csv') {
                // Download CSV file
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `subscription-report-${format(
                    new Date(),
                    'yyyy-MM-dd'
                )}.csv`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            } else {
                // Display JSON data
                const data = await response.json();
                console.log('Report data:', data);
            }
        } catch (error) {
            console.error('Error generating report:', error);
            alert('Failed to generate report');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Generate Report</h3>
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label
                            htmlFor="startDate"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Start Date
                        </label>
                        <input
                            type="date"
                            id="startDate"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="endDate"
                            className="block text-sm font-medium text-gray-700"
                        >
                            End Date
                        </label>
                        <input
                            type="date"
                            id="endDate"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Format
                    </label>
                    <div className="mt-1 space-x-4">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                value="csv"
                                checked={format === 'csv'}
                                onChange={(e) =>
                                    setFormat(e.target.value as 'csv' | 'json')
                                }
                                className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="ml-2">CSV</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                value="json"
                                checked={format === 'json'}
                                onChange={(e) =>
                                    setFormat(e.target.value as 'csv' | 'json')
                                }
                                className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="ml-2">JSON</span>
                        </label>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={generateReport}
                        disabled={!startDate || !endDate || isGenerating}
                        className={`px-4 py-2 rounded-md text-white ${
                            !startDate || !endDate || isGenerating
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    >
                        {isGenerating ? 'Generating...' : 'Generate Report'}
                    </button>
                </div>
            </div>
        </div>
    );
}
