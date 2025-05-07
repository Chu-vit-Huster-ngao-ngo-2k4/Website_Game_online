const fetch = require('node-fetch');

async function addGame() {
    try {
        const response = await fetch('http://localhost:5000/api/games/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: 'Rise Up',
                iframe_url: 'https://play.famobi.com/rise-up',
                thumbnail: 'https://html5games.com/Game/Rise-Up/de20e6f4-fd89-414f-b200-6a20b3ac9378/180x180.png'
            })
        });

        const data = await response.json();
        console.log('Game đã được thêm thành công:', data);
    } catch (error) {
        console.error('Lỗi khi thêm game:', error);
    }
}

addGame(); 