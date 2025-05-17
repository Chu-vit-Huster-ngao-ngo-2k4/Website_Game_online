// Games module
export const games = {
    async getAllGames() {
        try {
            const response = await fetch('http://localhost:5000/api/games/get');
            const data = await response.json();
            return data.map(game => ({
                id: game.id,
                title: game.title,
                category: game.category,
                thumbnail: game.thumbnail,
                iframe_url: game.iframe_url
            }));
        } catch (error) {
            console.error('Error fetching games:', error);
            throw error;
        }
    },

    async getGameById(id) {
        try {
            console.log('Fetching game with ID:', id);
            const response = await fetch(`http://localhost:5000/api/games/get?id=${id}`);
            
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Không tìm thấy game');
                }
                throw new Error(`Lỗi server: ${response.status}`);
            }

            const game = await response.json();
            console.log('Raw game data:', game);
            
            if (!game || !game.id) {
                throw new Error('Dữ liệu game không hợp lệ');
            }

            if (!game.iframe_url) {
                throw new Error('Game không có URL iframe');
            }

            return {
                id: game.id,
                title: game.title,
                category: game.category,
                thumbnail: game.thumbnail,
                iframe_url: game.iframe_url
            };
        } catch (error) {
            console.error('Error fetching game:', error);
            throw error;
        }
    },

    async addGame(gameData) {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:5000/api/games/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: gameData.title,
                    category: gameData.category,
                    thumbnail: gameData.thumbnail,
                    iframe_url: gameData.iframe_url
                })
            });
            return await response.json();
        } catch (error) {
            console.error('Error adding game:', error);
            throw error;
        }
    },

    async deleteGame(id) {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/api/games/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Error deleting game:', error);
            throw error;
        }
    }
}; 