import { Component, signal, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocketService } from '../services/socket.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private socketService = inject(SocketService);
  data = this.socketService.dashboardData;

  // Line chart for production over time
  public lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Production per Minute',
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4
      }
    ]
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  public lineChartType: ChartType = 'line';

  // Bar chart for active machines
  public barChartData: ChartData<'bar'> = {
    labels: ['Active Machines'],
    datasets: [
      {
        data: [0],
        label: 'Machines',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 1
      }
    ]
  };

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  public barChartType: ChartType = 'bar';

  // Doughnut chart for defect rate
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: ['Good', 'Defect'],
    datasets: [
      {
        data: [100, 0],
        backgroundColor: ['rgba(75, 192, 192, 0.5)', 'rgba(255, 99, 132, 0.5)'],
        borderColor: ['rgb(75, 192, 192)', 'rgb(255, 99, 132)'],
        borderWidth: 1
      }
    ]
  };

  public doughnutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false
  };

  public doughnutChartType: ChartType = 'doughnut';

  constructor() {
    effect(() => {
      const currentData = this.socketService.dashboardData();
      if (currentData) {
        this.updateCharts(currentData);
      }
    });
  }

  private updateCharts(data: any) {
    // Update line chart (keep last 10 data points)
    const time = new Date(data.timestamp).toLocaleTimeString();
    this.lineChartData.labels?.push(time);
    this.lineChartData.datasets[0].data.push(data.payload.productionPerMinute);
    
    if (this.lineChartData.labels!.length > 10) {
      this.lineChartData.labels?.shift();
      this.lineChartData.datasets[0].data.shift();
    }

    // Update bar chart
    this.barChartData.datasets[0].data = [data.payload.activeMachines];

    // Update doughnut chart
    const defectRate = data.payload.defectRate * 100;
    this.doughnutChartData.datasets[0].data = [100 - defectRate, defectRate];

    // Trigger change detection to update charts
    this.lineChartData = { ...this.lineChartData };
    this.barChartData = { ...this.barChartData };
    this.doughnutChartData = { ...this.doughnutChartData };
  }
}