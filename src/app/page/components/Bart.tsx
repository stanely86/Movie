import {Bar} from 'react-chartjs-2'
import {movieData} from './FakeData'
import{
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
)


export const BarChart = () =>{
    const option ={}
    return <Bar options={option} data={movieData}/>
}