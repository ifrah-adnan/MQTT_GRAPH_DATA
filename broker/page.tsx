// "use client";

// import { useState, useEffect, useCallback } from "react";
// import mqtt, { MqttClient } from "mqtt";
// import {
//   Line,
//   LineChart,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// const MQTT_BROKER = "wss://broker.hivemq.com:8884/mqtt";
// const DEFAULT_TOPIC = "sensor/data";
// const MAX_DATA_POINTS = 100; // Augmenté pour conserver plus de points de données

// interface RawSensorData {
//   temperature: number;
//   humidity: number;
// }

// interface SensorDataPoint extends RawSensorData {
//   time: string;
//   timestamp: number;
// }

// export default function Component() {
//   const [client, setClient] = useState<MqttClient | null>(null);
//   const [isConnected, setIsConnected] = useState(false);
//   const [topic, setTopic] = useState(DEFAULT_TOPIC);
//   const [sensorData, setSensorData] = useState<SensorDataPoint[]>([]);

//   const connectToBroker = useCallback(() => {
//     const mqttClient = mqtt.connect(MQTT_BROKER);

//     mqttClient.on("connect", () => {
//       console.log("Connected to MQTT broker");
//       setIsConnected(true);
//       mqttClient.subscribe(topic);
//     });

//     mqttClient.on("message", (topic, message) => {
//       const rawData = JSON.parse(message.toString()) as RawSensorData;
//       const now = Date.now();
//       const newDataPoint: SensorDataPoint = {
//         ...rawData,
//         time: new Date(now).toLocaleTimeString(),
//         timestamp: now,
//       };
//       setSensorData((prevData) =>
//         [...prevData, newDataPoint].slice(-MAX_DATA_POINTS)
//       );
//     });

//     mqttClient.on("error", (err) => {
//       console.error("MQTT Error:", err);
//       setIsConnected(false);
//     });

//     setClient(mqttClient);
//   }, [topic]);

//   const disconnectFromBroker = useCallback(() => {
//     if (client) {
//       client.end();
//       setIsConnected(false);
//       setClient(null);
//     }
//   }, [client]);

//   const handleTopicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setTopic(e.target.value);
//   };

//   const handleTopicSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (client && isConnected) {
//       client.unsubscribe(DEFAULT_TOPIC);
//       client.subscribe(topic);
//     }
//   };

//   useEffect(() => {
//     return () => {
//       if (client) {
//         client.end();
//       }
//     };
//   }, [client]);

//   const formatXAxis = (timestamp: number) => {
//     const date = new Date(timestamp);
//     return `${date.getMinutes()}:${date
//       .getSeconds()
//       .toString()
//       .padStart(2, "0")}`;
//   };

//   return (
//     <Card className="w-full ">
//       <CardHeader>
//         <CardTitle>Données des capteurs en temps réel via MQTT</CardTitle>
//         <CardDescription>Connecté au broker HiveMQ public</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="mb-4 flex items-center space-x-2">
//           {!isConnected ? (
//             <Button onClick={connectToBroker}>Connecter</Button>
//           ) : (
//             <Button onClick={disconnectFromBroker} variant="destructive">
//               Déconnecter
//             </Button>
//           )}
//           <form onSubmit={handleTopicSubmit} className="flex-1 flex space-x-2">
//             <Input
//               type="text"
//               value={topic}
//               onChange={handleTopicChange}
//               placeholder="Entrez le topic MQTT"
//               className="flex-1"
//             />
//             <Button type="submit">Changer de topic</Button>
//           </form>
//         </div>
//         <ChartContainer
//           config={{
//             temperature: {
//               label: "Température",
//               color: "hsl(var(--chart-1))",
//             },
//             humidity: {
//               label: "Humidité",
//               color: "hsl(var(--chart-2))",
//             },
//           }}
//           className="h-[400px]"
//         >
//           <ResponsiveContainer width="100%" height="100%">
//             <LineChart
//               data={sensorData}
//               margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//             >
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis
//                 dataKey="timestamp"
//                 tickFormatter={formatXAxis}
//                 type="number"
//                 domain={["dataMin", "dataMax"]}
//               />
//               <YAxis />
//               <ChartTooltip
//                 content={<ChartTooltipContent />}
//                 labelFormatter={(label) => new Date(label).toLocaleTimeString()}
//               />
//               <Legend />
//               <Line
//                 type="linear"
//                 dataKey="temperature"
//                 stroke="var(--color-temperature)"
//                 name="Température"
//                 dot={{
//                   stroke: "var(--color-temperature)",
//                   strokeWidth: 2,
//                   r: 4,
//                   fill: "var(--color-temperature)",
//                 }}
//                 activeDot={{ r: 6 }}
//                 strokeWidth={2}
//                 connectNulls
//               />
//               <Line
//                 type="linear"
//                 dataKey="humidity"
//                 stroke="var(--color-humidity)"
//                 name="Humidité"
//                 dot={{
//                   stroke: "var(--color-humidity)",
//                   strokeWidth: 2,
//                   r: 4,
//                   fill: "var(--color-humidity)",
//                 }}
//                 activeDot={{ r: 6 }}
//                 strokeWidth={2}
//                 connectNulls
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </ChartContainer>
//       </CardContent>
//     </Card>
//   );
// }
