import requests
import json

class OFAPI:
    def __init__(self, apiKey):
        self._apiKey = apiKey
        self._baseUrl = "https://ofapi.xyz"

    def sign_request(self, data):
        response = requests.post(
            self._baseUrl + "/sign",
            headers={'api-key': self._apiKey, 'Content-Type': 'application/json'},
            data=json.dumps(data)
        )
        return response.json()

    async def fetch(self, url, user_data):
        signed_headers = await self.sign_request({
            'url': url,
            'method': 'GET',
            **user_data
        })

        response = requests.get(url, headers=signed_headers)
        return response.json()


ofapi = OFAPI("MY_API_KEY")

# Example usage
streams = ofapi.fetch(
    "https://onlyfans.com/api2/v2/streams/feed?limit=10&skip_users=all", 
    {
        'xbc': '8g6756r78hioe45e65tuhads12',
        'sess': '37892uhdfoskjdsiagyiqewads1',
        'user_id': '123456789',
        'user_agent': 'Mozilla .........'
    }
)

# do something with the fetched data...
