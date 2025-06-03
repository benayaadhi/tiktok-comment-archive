
import asyncio
import websockets
import json
from TikTokLive import TikTokLiveClient
from TikTokLive.events import ConnectEvent, CommentEvent, LiveEndEvent

connected_clients = set()
tiktok_client = None
current_username = None

async def websocket_handler(websocket):
    connected_clients.add(websocket)
    print(f"🔌 New client connected. Total clients: {len(connected_clients)}")
    try:
        async for message in websocket:
            try:
                data = json.loads(message)
                if data.get("action") == "connect" and data.get("username"):
                    username = data["username"]
                    print(f"📝 Received request to connect to @{username}")
                    await start_tiktok_client(username)
                    # Send confirmation back to client
                    await websocket.send(json.dumps({
                        "type": "status",
                        "message": f"Connecting to @{username}..."
                    }))
                elif data.get("action") == "disconnect":
                    if tiktok_client:
                        await tiktok_client.disconnect()
                        print("🔌 TikTok client disconnected")
            except json.JSONDecodeError:
                print("❌ Invalid JSON received")
            except Exception as e:
                print(f"❌ Error handling message: {e}")
    except websockets.exceptions.ConnectionClosed:
        pass
    finally:
        connected_clients.remove(websocket)
        print(f"🔌 Client disconnected. Total clients: {len(connected_clients)}")

async def broadcast_comment(username, nickname, comment):
    if connected_clients:
        message = json.dumps({
            "type": "comment",
            "username": username,
            "nickname": nickname,
            "comment": comment
        })
        disconnected = set()
        for client in connected_clients:
            try:
                await client.send(message)
            except:
                disconnected.add(client)
        for client in disconnected:
            connected_clients.discard(client)

async def start_tiktok_client(username):
    global tiktok_client, current_username

    if tiktok_client and current_username == username:
        print(f"⚠️ Already connected to @{username}")
        return

    if tiktok_client:
        await tiktok_client.disconnect()

    current_username = username
    print(f"\n🎯 Connecting to TikTok Live for @{username}")
    tiktok_client = TikTokLiveClient(unique_id=username)

    @tiktok_client.on(ConnectEvent)
    async def on_connect(event: ConnectEvent):
        print(f"✅ Connected to @{event.unique_id}")
        print("🔁 Listening for comments...\n")
        # Broadcast connection success to all clients
        if connected_clients:
            status_message = json.dumps({
                "type": "status",
                "message": f"✅ Connected to @{event.unique_id}",
                "connected": True
            })
            for client in connected_clients:
                try:
                    await client.send(status_message)
                except:
                    pass

    @tiktok_client.on(CommentEvent)
    async def on_comment(event: CommentEvent):
        print(f"💬 {event.user.nickname}: {event.comment}")
        await broadcast_comment(
            username=event.user.unique_id,
            nickname=event.user.nickname,
            comment=event.comment
        )

    @tiktok_client.on(LiveEndEvent)
    async def on_live_end(event: LiveEndEvent):
        print("📴 Livestream ended.")
        if connected_clients:
            status_message = json.dumps({
                "type": "status",
                "message": "📴 Livestream ended",
                "connected": False
            })
            for client in connected_clients:
                try:
                    await client.send(status_message)
                except:
                    pass
        await tiktok_client.disconnect()

    asyncio.create_task(tiktok_client.start())

async def main():
    # Start WebSocket server
    ws_server = await websockets.serve(websocket_handler, "localhost", 8765)
    print("🚀 WebSocket server started on ws://localhost:8765")
    print("💡 Send JSON message with 'action': 'connect' and 'username': 'target_username' to start")
    
    # Keep the server running
    await ws_server.wait_closed()

if __name__ == '__main__':
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("⛔ Stopped by user.")
