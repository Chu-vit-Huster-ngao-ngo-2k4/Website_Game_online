// Comments module
export const comments = {
    async getComments(gameId) {
        try {
            const response = await fetch(`http://localhost:5000/api/comments/get/${gameId}`);
            if (!response.ok) {
                throw new Error('Không thể lấy bình luận');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching comments:', error);
            throw error;
        }
    },

    async addComment(gameId, content) {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:5000/api/comments/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    gameId,
                    content
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Không thể thêm bình luận');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error adding comment:', error);
            throw error;
        }
    },

    async deleteComment(commentId) {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/api/comments/delete/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Không thể xóa bình luận');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error deleting comment:', error);
            throw error;
        }
    }
}; 