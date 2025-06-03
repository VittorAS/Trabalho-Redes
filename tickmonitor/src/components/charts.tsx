"use client";

import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent
} from '@/components/ui/chart';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';

export const description = "An interactive area chart";

//simulação de dados que poderia ta no banco de dados
function generateChartData(records = 100, startDate = new Date()) {
  const data = [];
  let currentInput = 100;
  let currentOutput = 80;

  for (let i = 0; i < records; i++) {
    const inputDelta = Math.floor(Math.random() * 11);
    const outputDelta = Math.floor(Math.random() * 8);

    currentInput += inputDelta;
    currentOutput += outputDelta;

    const datetime = new Date(startDate.getTime() + i * 10000);

    data.push({
      datetime: datetime.toISOString().slice(0, 19),
      input: currentInput,
      output: currentOutput,
    });
  }

  return data;
}

//formato do item q precisa retornar na função
type ChartItem = {
  datetime: string;
  input: number;
  output: number;
  inputDelta?: number;
  outputDelta?: number;
};

//calcula a diferença entre os valores
function calculateDeltas(data: ChartItem[]): ChartItem[] {
  if (data.length === 0) return [];

  return data.map((item, index) => {
    if (index === 0) {
      return { ...item, inputDelta: 0, outputDelta: 0 };
    }
    return {
      ...item,
      inputDelta: item.input - data[index - 1].input,
      outputDelta: item.output - data[index - 1].output,
    };
  });
}

//configuração de lines do grafico
const chartConfig = {
  input: {
    label: "Input",
    color: "var(--chart-1)",
  },
  output: {
    label: "Output",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

//intervalo de tempo para atualização
const INTERVAL_MS = 10000;

export function ChartAreaInteractive() {
  //estado do grafico com inicio com a função que falei q poderia substituir pela informação do banco de dados
  const [chartData, setChartData] = React.useState<ChartItem[]>(() =>
    generateChartData(60, new Date(Date.now() - 600000))
  );

  const [timeRange, setTimeRange] = React.useState("10m");

  React.useEffect(() => {

    //função para gerar os dados, substitui pela biblioteca ou api que pega as informações do microtick
    function generateNextDataPoint(lastData: ChartItem): ChartItem {
      const inputDelta = Math.floor(Math.random() * 11);
      const outputDelta = Math.floor(Math.random() * 8);

      return {
        datetime: new Date(new Date(lastData.datetime).getTime() + INTERVAL_MS)
          .toISOString()
          .slice(0, 19),
        input: lastData.input + inputDelta,
        output: lastData.output + outputDelta,
      };
    }

    const intervalId = setInterval(() => {

        //atualiza o grafico com os dados   
      setChartData((prevData) => {
        if (prevData.length === 0) {
          // cria o primeiro dado inicial arbitrário
          const now = new Date();
          const firstData: ChartItem = {
            datetime: now.toISOString().slice(0, 19),
            input: 100,
            output: 80,
          };
          return [firstData];
        }

        const lastData = prevData[prevData.length - 1];
        const nextData = generateNextDataPoint(lastData);

        const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
        const newData = [...prevData, nextData].filter(
          (d) => new Date(d.datetime).getTime() >= tenMinutesAgo
        );

        return newData;
      });
    }, INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, []);

  // Filtra dados conforme o timeRange selecionado
  const now = Date.now();
  const filteredData = chartData.filter((item) => {
    const date = new Date(item.datetime).getTime();

    let timeLimit = 10 * 60 * 1000; // padrão: 10 minutos

    if (timeRange === "1h") {
      timeLimit = 60 * 60 * 1000;
    } else if (timeRange === "1d") {
      timeLimit = 24 * 60 * 60 * 1000;
    } else if (timeRange === "7d") {
      timeLimit = 7 * 24 * 60 * 60 * 1000;
    }

    return now - date <= timeLimit;
  });

  const dataWithDeltas = calculateDeltas(filteredData);

  return (
    <Card className="h-full flex flex-col justify-center">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row mb-auto">
        <div className="grid flex-1 gap-1">
          <CardTitle>Tick Monitor</CardTitle>
          <CardDescription>
            A simple tool to track real-time upload and download traffic from
            your MikroTik router interfaces.
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="10m" className="rounded-lg">
              Last 10 minutes
            </SelectItem>
            <SelectItem value="1h" className="rounded-lg">
              Last hour
            </SelectItem>
            <SelectItem value="1d" className="rounded-lg">
              Last day
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last week
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="flex mb-10 py-20 h-full">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-full w-full py-20"
        >
          <AreaChart data={dataWithDeltas}>
            <defs>
              <linearGradient id="fillInput" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-input)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-input)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillOutput" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-output)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-output)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="datetime"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleTimeString("en-US", { hour12: false }); // HH:mm:ss
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: false,
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="inputDelta"
              type="natural"
              fill="url(#fillInput)"
              stroke="var(--color-input)"
              stackId="a"
            />
            <Area
              dataKey="outputDelta"
              type="natural"
              fill="url(#fillOutput)"
              stroke="var(--color-output)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
