# consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer

class TeamChangeConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Accept the WebSocket connection
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        # Parse the received data
        data = json.loads(text_data)
        player_id = data['player_id']
        new_team_name = data['new_team_name']

        # Update the player team in the database (this should be done by your view)
        # You can also handle database updates here

        # Send the updated team info back to the client
        await self.send(text_data=json.dumps({
            'player_id': player_id,
            'new_team_name': new_team_name
        }))
