import os
import sqlite3
import json
from datetime import datetime
from typing import List, Dict, Any, Optional

class ChatStorage:
    def __init__(self):
        # Create data directory if it doesn't exist
        self.data_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'data')
        os.makedirs(self.data_dir, exist_ok=True)
        
        # Set database path
        self.db_path = os.path.join(self.data_dir, 'chat.db')
        self._init_db()
    
    def _init_db(self):
        """Initialize the SQLite database and create necessary tables."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Create chat_sessions table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS chat_sessions (
                session_id TEXT PRIMARY KEY,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                metadata TEXT
            )
        ''')
        
        # Create chat_messages table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS chat_messages (
                message_id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT,
                role TEXT NOT NULL,
                content TEXT NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (session_id) REFERENCES chat_sessions(session_id)
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def create_session(self, session_id: str, metadata: Optional[Dict[str, Any]] = None) -> bool:
        """Create a new chat session."""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute(
                'INSERT INTO chat_sessions (session_id, metadata) VALUES (?, ?)',
                (session_id, json.dumps(metadata) if metadata else None)
            )
            
            conn.commit()
            conn.close()
            return True
        except Exception as e:
            print(f"Error creating session: {str(e)}")
            return False
    
    def add_message(self, session_id: str, role: str, content: str) -> bool:
        """Add a message to a chat session."""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Add message
            cursor.execute(
                'INSERT INTO chat_messages (session_id, role, content) VALUES (?, ?, ?)',
                (session_id, role, content)
            )
            
            # Update session last_updated timestamp
            cursor.execute(
                'UPDATE chat_sessions SET last_updated = CURRENT_TIMESTAMP WHERE session_id = ?',
                (session_id,)
            )
            
            conn.commit()
            conn.close()
            return True
        except Exception as e:
            print(f"Error adding message: {str(e)}")
            return False
    
    def get_session_messages(self, session_id: str) -> List[Dict[str, Any]]:
        """Get all messages for a session."""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute(
                'SELECT role, content, timestamp FROM chat_messages WHERE session_id = ? ORDER BY timestamp',
                (session_id,)
            )
            
            messages = [
                {
                    'role': row[0],
                    'content': row[1],
                    'timestamp': row[2]
                }
                for row in cursor.fetchall()
            ]
            
            conn.close()
            return messages
        except Exception as e:
            print(f"Error getting messages: {str(e)}")
            return []
    
    def get_session(self, session_id: str) -> Optional[Dict[str, Any]]:
        """Get session details."""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute(
                'SELECT session_id, created_at, last_updated, metadata FROM chat_sessions WHERE session_id = ?',
                (session_id,)
            )
            
            row = cursor.fetchone()
            conn.close()
            
            if row:
                return {
                    'session_id': row[0],
                    'created_at': row[1],
                    'last_updated': row[2],
                    'metadata': json.loads(row[3]) if row[3] else None
                }
            return None
        except Exception as e:
            print(f"Error getting session: {str(e)}")
            return None
    
    def list_sessions(self, limit: int = 10, offset: int = 0) -> List[Dict[str, Any]]:
        """List recent chat sessions."""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute(
                '''
                SELECT session_id, created_at, last_updated, metadata 
                FROM chat_sessions 
                ORDER BY last_updated DESC 
                LIMIT ? OFFSET ?
                ''',
                (limit, offset)
            )
            
            sessions = [
                {
                    'session_id': row[0],
                    'created_at': row[1],
                    'last_updated': row[2],
                    'metadata': json.loads(row[3]) if row[3] else None
                }
                for row in cursor.fetchall()
            ]
            
            conn.close()
            return sessions
        except Exception as e:
            print(f"Error listing sessions: {str(e)}")
            return []
    
    def delete_session(self, session_id: str) -> bool:
        """Delete a chat session and all its messages."""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Delete messages first (due to foreign key constraint)
            cursor.execute('DELETE FROM chat_messages WHERE session_id = ?', (session_id,))
            
            # Delete session
            cursor.execute('DELETE FROM chat_sessions WHERE session_id = ?', (session_id,))
            
            conn.commit()
            conn.close()
            return True
        except Exception as e:
            print(f"Error deleting session: {str(e)}")
            return False 