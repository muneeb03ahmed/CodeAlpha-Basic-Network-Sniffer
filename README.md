# 🛡️ Basic Network Sniffer

A full-stack network packet monitoring system that captures live network traffic and visualizes it through a modern web dashboard.

---

## 🚀 Features

- Capture live network packets  
- Display source and destination IP addresses  
- Identify protocols (TCP, UDP, Others)  
- Extract packet payload (limited preview)  
- Interactive dashboard UI  
- Fast frontend built with python + Vite + React + TypeScript  
- Clean UI using Tailwind CSS  

---

## 🏗️ Tech Stack

Frontend:
- React (TypeScript)  
- Vite  
- Tailwind CSS  
- ShadCN UI  

Backend:
- Python  
- Scapy  

---

## ⚙️ Installation

Clone Repository:

git clone https://github.com/muneeb03ahmed/CodeAlpha-Basic-Network-Sniffer.git 

---

## 🔹 Frontend Setup

cd frontend  
npm install  
npm run dev  

Open in browser:  
http://localhost:8080/  

---

## 🔹 Backend Setup

python -m venv venv  
venv\Scripts\activate  
pip install scapy    

---

## 📡 Working Flow

Network Interface → Packet Capture (Scapy) → Processing → Dashboard Display  

---

## 🧪 Sample Output

New Packet Captured  
Source IP: 192.168.1.5  
Destination IP: 142.250.190.78  
Protocol: TCP  
Payload: GET / HTTP/1.1...  

---

## 🔐 Security

- Educational use only  
- Do not monitor unauthorized networks  
- Requires admin privileges  

---

## ⚠️ Limitations

- No HTTPS decryption  
- Limited inspection depth  
- Needs root/admin access  

---

## 🚀 Future Scope

- WebSocket real-time streaming  
- Advanced filters  
- Graph analytics  
- IDS integration  

---

## 📚 Learning Outcomes

- Packet structure understanding  
- Network protocol basics  
- Real-time monitoring  
- Full-stack integration  

---

## 📄 License

Open-source for educational use  
