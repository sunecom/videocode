const WebSocket = require('ws');

const PORT = 8765;
const wss = new WebSocket.Server({ port: PORT });

console.log(`🚀 VideoCode v2.0 WebSocket Server started on ws://localhost:${PORT}`);

let encoder = null;
let decoders = [];

wss.on('connection', (ws, req) => {
    const urlParams = new URLSearchParams(req.url.split('?')[1]);
    const role = urlParams.get('role') || 'decoder';
    
    console.log(`📡 New connection: ${role} (${req.socket.remoteAddress})`);
    
    if (role === 'encoder') {
        encoder = ws;
        console.log('✅ Encoder connected');
        
        ws.on('message', (data) => {
            // 广播给所有 decoders
            decoders.forEach((decoder, index) => {
                if (decoder.readyState === WebSocket.OPEN) {
                    decoder.send(data);
                } else {
                    decoders.splice(index, 1);
                }
            });
        });
        
        ws.on('close', () => {
            console.log('❌ Encoder disconnected');
            encoder = null;
        });
    } else {
        decoders.push(ws);
        console.log(`✅ Decoder connected (total: ${decoders.length})`);
        
        ws.on('close', () => {
            const index = decoders.indexOf(ws);
            if (index > -1) {
                decoders.splice(index, 1);
            }
            console.log(`❌ Decoder disconnected (total: ${decoders.length})`);
        });
    }
    
    ws.on('error', (err) => {
        console.error('WebSocket error:', err);
    });
});

console.log('Waiting for connections...');
console.log('- Encoder: ws://localhost:8765/?role=encoder');
console.log('- Decoder: ws://localhost:8765/?role=decoder');
