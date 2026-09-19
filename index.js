const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { translate } = require('@vitalets/google-translate-api');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
        ]
    }
});

// Exibe o QR Code no terminal para autenticar o WhatsApp
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Bot conectado e pronto para traduzir!');
});

// Usamos 'message_create' para que o bot leia mensagens enviadas por QUALQUER UM (inclusive você mesmo)
client.on('message_create', async (msg) => {
    const textoMensagem = msg.body.trim();

    // Verifica se a mensagem começa com /traduzir
    if (textoMensagem.startsWith('/traduzir')) {
        console.log('Comando /traduzir detectado:', textoMensagem);

        let textoParaTraduzir = '';
        const args = textoMensagem.replace('/traduzir', '').trim();

        if (args.length > 0) {
            // Caso 1: /traduzir Hello
            textoParaTraduzir = args;
        } else if (msg.hasQuotedMsg) {
            // Caso 2: /traduzir respondendo a outra mensagem
            try {
                const mensagemCitada = await msg.getQuotedMessage();
                textoParaTraduzir = mensagemCitada.body;
            } catch (err) {
                console.error('Erro ao pegar mensagem citada:', err);
            }
        } else {
            return msg.reply('Uso correto:\n1. `/traduzir Texto aqui`\n2. Responda a uma mensagem apenas com `/traduzir`');
        }

        if (!textoParaTraduzir) {
            return msg.reply('Não encontrei nenhum texto para traduzir!');
        }

        try {
            console.log('Traduzindo:', textoParaTraduzir);
            
            // Traduz para o português
            const resultado = await translate(textoParaTraduzir, { to: 'pt' });

            // Responde a mensagem
            await msg.reply(`*Tradução:* ${resultado.text}`);
            console.log('Tradução enviada com sucesso!');
        } catch (erro) {
            console.error('Erro ao traduzir:', erro);
            await msg.reply('Ocorreu um erro ao tentar traduzir.');
        }
    }
});

client.initialize();
