#!/usr/bin/env python3
"""
Quick test script for chat endpoint
"""
import requests
import sys

BASE_URL = "http://localhost:8000"

def test_chat(session_id: str):
    """Test the chat endpoint with a sample question"""
    
    print(f"\n{'='*60}")
    print(f"Testing Chat Endpoint")
    print(f"{'='*60}")
    
    # Test question
    test_message = "Why did you diagnose this disease?"
    
    print(f"\n📤 Sending chat request...")
    print(f"   Session ID: {session_id}")
    print(f"   Question: {test_message}")
    
    try:
        response = requests.post(
            f"{BASE_URL}/chat",
            json={
                "session_id": session_id,
                "message": test_message
            },
            timeout=30
        )
        
        print(f"\n📥 Response Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"\n✅ Chat is working!")
            print(f"\n💬 AI Response:")
            print(f"   {data.get('response', 'No response')}")
            return True
        else:
            print(f"\n❌ Chat failed!")
            print(f"   Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"\n❌ Request failed: {str(e)}")
        return False

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python test_chat.py <session_id>")
        print("\nExample:")
        print("  python test_chat.py 8b561891-b048-4624-88a2-2c05366f9f31")
        sys.exit(1)
    
    session_id = sys.argv[1]
    success = test_chat(session_id)
    sys.exit(0 if success else 1)
