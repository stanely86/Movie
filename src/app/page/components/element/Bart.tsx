// BarChart.tsx
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface BarChartProps {
    movieId: string;
}

interface ChartData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string;
        borderColor: string;
        borderWidth: number;
    }[];
}

const BarChart: React.FC<BarChartProps> = ({ movieId }) => {
    const [chartData, setChartData] = useState<ChartData | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            const url = `https://imdb8.p.rapidapi.com/title/get-ratings?tconst=${movieId}`;
            const options = {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': '87d4b5ab45mshe5e256ac4029f3bp11b320jsnd250a4fe1339',
                    'x-rapidapi-host': 'imdb8.p.rapidapi.com'
                }
            };

            for (let attempt = 0; attempt < 3; attempt++) {
                try {
                    const response = await fetch(url, options);

                    if (response.status === 429) {
                        const waitTime = 1000 * (attempt + 1); // Wait longer with each attempt
                        await new Promise(resolve => setTimeout(resolve, waitTime));
                        continue; // Retry the fetch
                    }

                    const result = await response.json();
                    if (isMounted) {
                        const transformedData = transformData(result);
                        setChartData(transformedData);
                    }
                    break; // Exit loop if successful
                } catch (error) {
                    console.error(error);
                    break; // Exit loop on error
                }
            }
        };

        fetchData();
        return () => {
            isMounted = false; // Cleanup on unmount
        };
    }, [movieId]);

    const transformData = (apiData: any) => {
        const labels = [
            "US users",
            "Males",
            "Females Aged 45+",
            "Aged under 18",
            "IMDb Staff",
            "Aged 18-29",
            "Top 1000 voters",
            "Males Aged 18-29",
            "Non-US users",
            "Females Aged 30-44",
            "Aged 30-44",
            "Females",
            "Males Aged under 18",
            "Males Aged 30-44",
            "Females Aged under 18",
            "Aged 45+",
            "Males Aged 45+",
            "Females Aged 18-29",
            "IMDb Users"
        ];

        const ratingsHistograms = apiData.ratingsHistograms || {};

        const data = labels.map(label => {
            const histogramData = ratingsHistograms[label];
            return histogramData ? histogramData.aggregateRating : 0;
        });

        return {
            labels,
            datasets: [
                {
                    label: "Aggregated Rating",
                    data,
                    backgroundColor: "rgba(255,99,132,0.2)",
                    borderColor: "rgba(245, 40, 145, 0.8)",
                    borderWidth: 1,
                    hoverBorderColor: "rgba(255, 215, 0, 0.75)",
                    hoverBorderWidth: 3
                }
            ]
        };
    };

    const options = {
        // Add any chart options you need here
    };

    return chartData ? <Bar options={options} data={chartData} /> : <p>Loading...</p>;
};

export default BarChart;
