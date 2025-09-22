from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_socketio import emit, join_room, leave_room, rooms
from app import db
from app.models import User, Event, ChatRoom, Message
import uuid

chat_bp = Blueprint('chat', __name__, url_prefix='/api/chat')

@chat_bp.route('/events/<event_id>/messages', methods=['GET'])
@jwt_required()
def get_chat_messages(event_id):
    """
    Get chat messages for an event
    Only accessible to event attendees
    """
    try:
        user_id = get_jwt_identity()
        event = Event.query.get(event_id)
        
        if not event:
            return jsonify({'error': 'Event not found'}), 404
        
        # Check if user is attending the event
        if not event.attendees or user_id not in event.attendees:
            return jsonify({'error': 'Access denied. You must be attending this event to view chat.'}), 403
        
        # Get or create chat room
        chat_room = ChatRoom.query.filter_by(event_id=event_id).first()
        if not chat_room:
            chat_room = ChatRoom(event_id=event_id)
            db.session.add(chat_room)
            db.session.commit()
        
        # Get messages with pagination
        limit = int(request.args.get('limit', 50))
        offset = int(request.args.get('offset', 0))
        
        messages = Message.query.filter_by(chat_room_id=chat_room.id)\
                                .order_by(Message.created_at.desc())\
                                .offset(offset)\
                                .limit(limit)\
                                .all()
        
        # Reverse to show oldest first
        messages.reverse()
        
        print(f"📱 Retrieved {len(messages)} messages for event {event.title}")
        
        return jsonify({
            'messages': [message.to_dict() for message in messages],
            'chat_room_id': chat_room.id,
            'total': Message.query.filter_by(chat_room_id=chat_room.id).count()
        }), 200
        
    except Exception as e:
        print(f"❌ Get messages error: {str(e)}")
        return jsonify({'error': 'Failed to get messages'}), 500

@chat_bp.route('/events/<event_id>/messages', methods=['POST'])
@jwt_required()
def send_message(event_id):
    """
    Send a message to event chat
    Only accessible to event attendees
    """
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data or not data.get('content'):
            return jsonify({'error': 'Message content is required'}), 400
        
        event = Event.query.get(event_id)
        if not event:
            return jsonify({'error': 'Event not found'}), 404
        
        # Check if user is attending the event
        if not event.attendees or user_id not in event.attendees:
            return jsonify({'error': 'Access denied. You must be attending this event to send messages.'}), 403
        
        # Get or create chat room
        chat_room = ChatRoom.query.filter_by(event_id=event_id).first()
        if not chat_room:
            chat_room = ChatRoom(event_id=event_id)
            db.session.add(chat_room)
            db.session.commit()
        
        # Create message
        message = Message(
            chat_room_id=chat_room.id,
            user_id=user_id,
            content=data.get('content').strip(),
            message_type=data.get('message_type', 'text')
        )
        
        db.session.add(message)
        db.session.commit()
        
        message_data = message.to_dict()
        
        print(f"💬 New message in {event.title}: {message.content[:50]}...")
        
        # Emit to all connected clients (simplified approach)
        from app import socketio
        socketio.emit('new_message', {
            **message_data,
            'event_id': event_id  # Include event_id so frontend can filter
        })
        print(f"📡 Broadcasted message globally with event_id: {event_id}")
        
        return jsonify({
            'message': 'Message sent successfully',
            'data': message_data
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"❌ Send message error: {str(e)}")
        return jsonify({'error': 'Failed to send message'}), 500

# Socket.IO Events moved to register_socketio_events function below

# Socket.IO Events Registration Function
def register_socketio_events(socketio):
    """Register all Socket.IO events with the main app"""
    
    @socketio.on('join_event_chat')
    def handle_join_chat(data):
        """Join chat room for an event"""
        try:
            # For now, we'll skip JWT validation in Socket.IO and rely on HTTP API
            event_id = data.get('event_id')
            user_id = data.get('user_id')  # Pass from frontend
            
            if not event_id or not user_id:
                emit('error', {'message': 'Event ID and User ID are required'})
                return
            
            event = Event.query.get(event_id)
            if not event:
                emit('error', {'message': 'Event not found'})
                return
            
            # Check if user is attending
            if not event.attendees or user_id not in event.attendees:
                emit('error', {'message': 'Access denied. You must be attending this event.'})
                return
            
            # Join the Socket.IO room
            room_name = f"event_{event_id}"
            join_room(room_name)
            
            user = User.query.get(user_id)
            print(f"👥 {user.username if user else 'Unknown'} joined chat for {event.title}")
            
            # Notify others that user joined
            emit('user_joined_chat', {
                'username': user.username if user else 'Unknown',
                'user_id': user_id,
                'event_id': event_id
            }, room=room_name, include_self=False)
            
            emit('joined_chat', {
                'message': f'Joined chat for {event.title}',
                'room': room_name
            })
            
        except Exception as e:
            print(f"❌ Join chat error: {str(e)}")
            emit('error', {'message': 'Failed to join chat'})
    
    @socketio.on('leave_event_chat')
    def handle_leave_chat(data):
        """Leave chat room for an event"""
        try:
            event_id = data.get('event_id')
            user_id = data.get('user_id')
            
            if event_id:
                room_name = f"event_{event_id}"
                leave_room(room_name)
                
                user = User.query.get(user_id)
                event = Event.query.get(event_id)
                
                print(f"👋 {user.username if user else 'Unknown'} left chat for {event.title if event else 'Unknown Event'}")
                
                # Notify others that user left
                emit('user_left_chat', {
                    'username': user.username if user else 'Unknown',
                    'user_id': user_id,
                    'event_id': event_id
                }, room=room_name)
            
        except Exception as e:
            print(f"❌ Leave chat error: {str(e)}")
    
    @socketio.on('disconnect')
    def handle_disconnect():
        """Handle user disconnect"""
        print(f"🔌 User disconnected from chat")
    
    print("✅ Socket.IO events registered successfully")
