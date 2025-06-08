// Rating module
export const rating = {
    async getRating(gameId) {
        try {
            const response = await fetch(`http://localhost:5000/api/ratings/get/${gameId}`);
            if (!response.ok) {
                throw new Error('Không thể lấy đánh giá');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching rating:', error);
            throw error;
        }
    },

    async addRating(gameId, score) {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:5000/api/ratings/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    gameId,
                    score
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Không thể thêm đánh giá');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error adding rating:', error);
            throw error;
        }
    },

    async updateRating(ratingId, score) {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/api/ratings/update/${ratingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ score })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Không thể cập nhật đánh giá');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error updating rating:', error);
            throw error;
        }
    }
}; 