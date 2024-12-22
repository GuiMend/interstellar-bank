import { LineChart } from "@mantine/charts";
import { Card, Paper, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { getExchangeRate } from "api";
import { useAppContext } from "AppContext";
import { useEffect, useState } from "react";
import Loading from "./Loading";

const ExchangeRate: React.FC = () => {
  const {
    t,
    exchangeRate: latestExchangeRate,
    setExchangeRate,
    showProVersion,
  } = useAppContext();

  const [history, setHistory] = useState<Array<{ time: Date; rate: number }>>(
    []
  );

  const min = Math.min(...history.map(({ rate }) => rate));
  const max = Math.max(...history.map(({ rate }) => rate));

  const {
    isPending,
    isFetching,
    data: exchangeRate,
  } = useQuery({
    queryKey: ["exchangeRate"],
    queryFn: getExchangeRate,
    refetchInterval: 1000,
  });

  useEffect(() => {
    if (exchangeRate && !isFetching) {
      setHistory((prev) => [
        ...prev.slice(Math.max(prev.length - 10, 0)),
        { rate: parseFloat(exchangeRate), time: new Date() },
      ]);
      setExchangeRate?.(parseFloat(exchangeRate));
    }
  }, [exchangeRate, isFetching, setExchangeRate]);

  return (
    <Card>
      <Text fw={200}>{t.exchangeRate}</Text>
      {isPending && !latestExchangeRate ? (
        <Loading />
      ) : (
        <div>
          <Text fw={700}>1 GCS = {latestExchangeRate?.toFixed(3)} ICS</Text>
          {showProVersion && (
            <LineChart
              h={50}
              data={history}
              series={[
                {
                  name: "rate",
                  label: "1 GCS",
                  color: (latestExchangeRate ?? 1) >= 1 ? "blue" : "red",
                },
              ]}
              dataKey="date"
              withDots={false}
              withYAxis={false}
              withXAxis={false}
              strokeDasharray="0,10"
              referenceLines={[{ y: 1, color: "gray.6" }]}
              yAxisProps={{
                domain: [Math.min(min * 0.98, 0.9), Math.max(max * 1.02, 1.1)],
              }}
              valueFormatter={(value) => `${value} ICS`}
              tooltipProps={{
                content: ({ payload }) => {
                  if (!payload) return null;
                  return (
                    <Paper px="md" py="sm" withBorder shadow="md" radius="md">
                      {payload.map((item: any) => (
                        <Text key={item.name} c={item.color} fz="sm" fw={700}>
                          {item.value.toFixed(3)} ICS
                        </Text>
                      ))}
                    </Paper>
                  );
                },
              }}
            />
          )}
          <Text size="sm">
            {t.opening}: {history?.[0]?.rate.toFixed(3)}
          </Text>
          <Text size="sm">
            {t.min}: {min.toFixed(3)}
          </Text>
          <Text size="sm">
            {t.max}: {max.toFixed(3)}
          </Text>
        </div>
      )}
    </Card>
  );
};

export default ExchangeRate;
