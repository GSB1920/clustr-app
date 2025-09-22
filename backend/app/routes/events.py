from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import User, Event
from datetime import datetime, timedelta
import uuid

events_bp = Blueprint('events', __name__, url_prefix='/api/events')

@events_bp.route('', methods=['POST'])
@jwt_required()
def create_event():
    """
    Create a new event
    Expects JSON: {
        "title": "Event Title",
        "description": "Event description", 
        "categories": ["sports", "social"],
        "streetAddress": "123 Main St",
        "city": "San Francisco",
        "state": "CA",
        "zipCode": "94102",
        "landmark": "Near Golden Gate Park",
        "capacity": 25,
        "date": "2025-09-25T10:00:00Z"
    }
    """
    try:
        data = request.get_json()
        user_id = get_jwt_identity()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        print(f"📝 Creating event with data: {data}")
        print(f"🏷️ Categories received: {data.get('categories', [])}")
        print(f"🏷️ Categories type: {type(data.get('categories', []))}")
        print(f"🏷️ Categories length: {len(data.get('categories', []))}")
        
        # Validate required fields
        required_fields = ['title', 'description', 'categories', 'streetAddress', 'city', 'state', 'capacity']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Validate categories
        categories = data.get('categories', [])
        print(f"🔍 Categories after extraction: {categories}")
        if not categories or len(categories) == 0:
            return jsonify({'error': 'At least one category is required'}), 400
        # Validate capacity
        try:
            capacity = int(data.get('capacity'))
            if capacity < 1 or capacity > 9999:
                return jsonify({'error': 'Capacity must be between 1 and 9999'}), 400
        except (ValueError, TypeError):
            return jsonify({'error': 'Invalid capacity value'}), 400
        
        # Create full address
        full_address = f"{data.get('streetAddress')}, {data.get('city')}, {data.get('state')} {data.get('zipCode')}"
        if data.get('landmark'):
            full_address += f" ({data.get('landmark')})"
        
        # For now, use current time + 1 hour as default event time
        event_date = (datetime.utcnow() + timedelta(hours=1)).replace(minute=0, second=0, microsecond=0)
        
        # Get user
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        print(f"🎯 About to create event with:")
        print(f"  - category: {categories[0]}")
        print(f"  - tags: {categories}")
        print(f"  - tags type: {type(categories)}")
        # Create new event
        event = Event(
            id=str(uuid.uuid4()),
            title=data.get('title').strip(),
            description=data.get('description').strip(),
            category=categories[0],  # Primary category
            tags=categories,  # All selected categories as tags
            location=full_address,
            event_date=event_date,
            max_attendees=capacity,
            created_by=user_id
        )
        
        db.session.add(event)
        db.session.commit()
        
        print(f"✅ Event created successfully: {event.title}")
        
        return jsonify({
            'message': 'Event created successfully',
            'event': event.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"❌ Create event error: {str(e)}")
        return jsonify({'error': 'Failed to create event'}), 500

@events_bp.route('', methods=['GET'])
def get_events():
    """
    Get all events (public endpoint)
    Optional query params: category, search, limit, offset
    """
    try:
        # Get query parameters
        category = request.args.get('category')
        search = request.args.get('search')
        limit = int(request.args.get('limit', 50))
        offset = int(request.args.get('offset', 0))
        
        print(f"📋 Getting events - category: {category}, search: {search}")
        
        # Build query - get all events for now
        query = Event.query
        
        if category and category != 'all':
            # Filter by category in tags array
            query = query.filter(Event.tags.contains([category]))
        
        if search:
            search_term = f"%{search}%"
            query = query.filter(
                db.or_(
                    Event.title.ilike(search_term),
                    Event.description.ilike(search_term),
                    Event.location.ilike(search_term)
                )
            )
        
        # Order by date and apply pagination
        events = query.order_by(Event.event_date.asc()).offset(offset).limit(limit).all()
        
        print(f"✅ Found {len(events)} events")
        
        return jsonify({
            'events': [event.to_dict() for event in events],
            'total': query.count()
        }), 200
        
    except Exception as e:
        print(f"❌ Get events error: {str(e)}")
        return jsonify({'error': 'Failed to get events'}), 500

@events_bp.route('/<event_id>/join', methods=['POST'])
@jwt_required()
def join_event(event_id):
    """
    Join an event
    """
    try:
        user_id = get_jwt_identity()
        event = Event.query.get(event_id)
        
        if not event:
            return jsonify({'error': 'Event not found'}), 404
        
        # Initialize attendees if None
        if not event.attendees:
            event.attendees = []
        
        # Check if user already joined
        if user_id in event.attendees:
            return jsonify({
                'error': 'You have already joined this event',
                'event': event.to_dict()
            }), 400
        
        # Check if event is full
        current_attendees = len(event.attendees)
        if current_attendees >= event.max_attendees:
            return jsonify({
                'error': 'Event is full',
                'event': event.to_dict()
            }), 400
        
        # Add user to attendees
        event.attendees = event.attendees + [user_id]
        db.session.commit()
        
        print(f"✅ User {user_id} joined event '{event.title}' (now {len(event.attendees)} attendees)")
        
        return jsonify({
            'message': 'Successfully joined event',
            'event': event.to_dict(),
            'user_joined': True
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"❌ Join event error: {str(e)}")
        return jsonify({'error': 'Failed to join event'}), 500

@events_bp.route('/<event_id>/leave', methods=['POST'])
@jwt_required()
def leave_event(event_id):
    """
    Leave an event
    """
    try:
        user_id = get_jwt_identity()
        event = Event.query.get(event_id)
        
        if not event:
            return jsonify({'error': 'Event not found'}), 404
        
        # Check if user is actually attending
        if not event.attendees or user_id not in event.attendees:
            return jsonify({
                'error': 'You are not attending this event',
                'event': event.to_dict()
            }), 400
        
        # Remove user from attendees
        event.attendees = [uid for uid in event.attendees if uid != user_id]
        db.session.commit()
        
        print(f"✅ User {user_id} left event '{event.title}' (now {len(event.attendees)} attendees)")
        
        return jsonify({
            'message': 'Successfully left event',
            'event': event.to_dict(),
            'user_left': True
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"❌ Leave event error: {str(e)}")
        return jsonify({'error': 'Failed to leave event'}), 500