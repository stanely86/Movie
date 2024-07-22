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


export const BarChart: React.FC<BarChartProps> = ({ movieId }) => {
    const [chartData, setChartData] = useState<ChartData | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const url = `https://imdb8.p.rapidapi.com/title/get-ratings?tconst=${movieId}`;
            const options = {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': '272c20de72msh7600bfac64d9ec4p10d181jsne0a2759f8116',
                    'x-rapidapi-host': 'imdb8.p.rapidapi.com'
                }
            };

            try {
                const response = await fetch(url, options);
                const result = await response.json();
                const transformedData = transformData(result);
                setChartData(transformedData);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
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

        const ratingsHistograms = apiData.ratingsHistograms;

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
                    hoverBorderColor: "rgba(255, 215, 0, 0.75)", // Lighter border color on hover
                    hoverBorderWidth: 3 // Slightly wider border on hover
                }
            ]
        };
    };

    const options = {
    };

    return chartData ? <Bar options={options} data={chartData} /> : <p>Loading...</p>;
};
