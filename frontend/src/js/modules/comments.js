// Comments module
export const comments = {
    async getComments(gameId) {
        try {
            const response = await fetch(`http://localhost:5000/api/comments/get/${gameId}`);
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
            return await response.json();
        } catch (error) {
            console.error('Error deleting comment:', error);
            throw error;
        }
    }
}; 