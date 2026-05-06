import React from 'react';
import { Cpu, Activity, Zap, Layers, BarChart2, Monitor, Radio } from 'lucide-react';

export default function HardwareSidebar() {
  const onDragStart = (event, nodeData) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(nodeData));
    event.dataTransfer.effectAllowed = 'move';
  };

  const categories = [
    {
      title: "Microcontrollers (Brains)",
      icon: <Cpu size={14} className="text-blue-400" />,
      items: [
        { label: 'ESP32 WROOM', sub: 'esp32_wroom_32', data: { label: 'ESP32 Core', type: 'controller', category: 'brain', hardware_type: 'esp32', board_model: 'esp32_wroom_32' } },
        { label: 'ESP8266 NodeMCU', sub: 'esp8266', data: { label: 'NodeMCU', type: 'controller', category: 'brain', hardware_type: 'esp8266', board_model: 'nodemcu' } },
        { label: 'RP2040 Pico W', sub: 'rp2040', data: { label: 'Raspberry Pi Pico', type: 'controller', category: 'brain', hardware_type: 'rp2040', board_model: 'pico_w' } }
      ]
    },
    {
      title: "Sensors & Telemetry",
      icon: <BarChart2 size={14} className="text-emerald-400" />,
      items: [
        { label: 'DHT11 Temp/Hum', sub: 'dht11', data: { label: 'DHT11 Sensor', type: 'sensor', category: 'telemetry', hardware_module: 'dht11', display_name: 'Room Temp', ui_element: 'gauge' } },
        { label: 'Soil Moisture', sub: 'analog_moisture', data: { label: 'Soil Probe', type: 'sensor', category: 'telemetry', hardware_module: 'soil_moisture', display_name: 'Plant Moisture', ui_element: 'gauge' } },
        { label: 'INA219 Power Monitor', sub: 'ina219', data: { label: 'Current Sensor', type: 'sensor', category: 'telemetry', hardware_module: 'ina219', display_name: 'Power Usage', ui_element: 'graph' } },
        { label: 'BME280 Environment', sub: 'bme280', data: { label: 'Pressure/Alt', type: 'sensor', category: 'telemetry', hardware_module: 'bme280', display_name: 'Air Pressure', ui_element: 'graph' } },
        { label: 'PIR Motion', sub: 'hc_sr501', data: { label: 'Motion Sensor', type: 'sensor', category: 'telemetry', hardware_module: 'pir', display_name: 'Presence', ui_element: 'indicator' } }
      ]
    },
    {
      title: "Controls & Actuators",
      icon: <Zap size={14} className="text-amber-400" />,
      items: [
        { label: '5V Relay Module', sub: 'relay_1ch', data: { label: '1-Ch Relay', type: 'action', category: 'control', hardware_module: 'relay_5v', display_name: 'Power Switch', ui_element: 'toggle' } },
        { label: 'L298N Motor Driver', sub: 'l298n', data: { label: 'Motor Controller', type: 'action', category: 'control', hardware_module: 'motor_driver', display_name: 'Fan Speed', ui_element: 'slider' } },
        { label: 'SG90 Micro Servo', sub: 'sg90', data: { label: 'Servo Motor', type: 'action', category: 'control', hardware_module: 'servo', display_name: 'Valve Position', ui_element: 'slider' } },
        { label: 'WS2812B LED Array', sub: 'ws2812b', data: { label: 'RGB Strip', type: 'action', category: 'control', hardware_module: 'led_strip', display_name: 'Mood Light', ui_element: 'color_picker' } }
      ]
    },
    {
      title: "Displays & Screens",
      icon: <Monitor size={14} className="text-cyan-400" />,
      items: [
        { label: '0.96" OLED I2C', sub: 'ssd1306', data: { label: 'OLED Screen', type: 'display', category: 'peripheral', hardware_module: 'ssd1306', display_name: 'Status Screen', ui_element: 'text_display' } },
        { label: '16x2 LCD I2C', sub: 'lcd1602', data: { label: 'LCD Display', type: 'display', category: 'peripheral', hardware_module: 'lcd1602', display_name: 'Info Panel', ui_element: 'text_display' } }
      ]
    },
    {
      title: "Communications",
      icon: <Radio size={14} className="text-indigo-400" />,
      items: [
        { label: 'NRF24L01 Radio', sub: 'nrf24l01', data: { label: 'Radio Transceiver', type: 'comms', category: 'network', hardware_module: 'nrf24', display_name: 'Radio Link', ui_element: 'indicator' } },
        { label: 'LoRa SX1278', sub: 'lora_sx1278', data: { label: 'LoRa Module', type: 'comms', category: 'network', hardware_module: 'lora', display_name: 'Long Range', ui_element: 'indicator' } }
      ]
    }
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full z-10 shadow-2xl">
      <div className="p-4 border-b border-slate-800 bg-slate-900">
        <h3 className="text-white font-semibold flex items-center gap-2 tracking-wide">
          <Layers size={18} className="text-blue-500" /> Component Library
        </h3>
        <p className="text-xs text-slate-500 mt-1">Drag hardware nodes to the canvas to build your architecture.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-5 custom-scrollbar">
        {categories.map((cat, i) => (
          <div key={i} className="mb-2">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-3 px-1">
              {cat.icon} {cat.title}
            </h4>
            <div className="space-y-2">
              {cat.items.map((item, j) => (
                <div
                  key={j}
                  draggable
                  onDragStart={(e) => onDragStart(e, item.data)}
                  className="bg-slate-800 border border-slate-700/50 p-2.5 rounded-lg cursor-grab active:cursor-grabbing hover:border-slate-500 hover:bg-slate-700 transition-all duration-200 shadow-sm"
                >
                  <p className="text-sm text-slate-100 font-medium leading-tight">{item.label}</p>
                  <p className="text-[10px] text-slate-500 font-mono mt-1">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}