using Newtonsoft.Json;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace OF_DL.Entities
{
    // Define your JSON structure in the class
    public class OFAPIJson
    {
        [JsonProperty(PropertyName = "xbc")]
        public string? Xbc { get; set; }

        [JsonProperty(PropertyName = "sess")]
        public string? Sess { get; set; }

        [JsonProperty(PropertyName = "user_id")]
        public string? UserId { get; set; }

        [JsonProperty(PropertyName = "user_agent")]
        public string? UserAgent { get; set; }
    }

    // Example library to fetch data from the OF API
    public class OFAPI
    {
        private readonly string _apiKey;
        private readonly string _baseUrl = "https://ofapi.xyz";

        public OFAPI(string apiKey)
        {
            _apiKey = apiKey;
        }

        // Method to sign a request
        private async Task<Dictionary<string, string>> SignRequestAsync(OFAPIJson data)
        {
            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Add("api-key", _apiKey);
                var json = JsonConvert.SerializeObject(data);
                var response = await client.PostAsync(_baseUrl + "/sign", new StringContent(json, System.Text.Encoding.UTF8, "application/json"));
                response.EnsureSuccessStatusCode();
                var jsonResponse = await response.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<Dictionary<string, string>>(jsonResponse);
            }
        }

        // Wrapper function to fetch data from any URL
        public async Task<object> FetchAsync(string url, OFAPIJson userData)
        {
            // Sign the request first
            var signedHeaders = await SignRequestAsync(userData);

            // Fetch the OF API data using the signed headers
            using (var client = new HttpClient())
            {
                var request = new HttpRequestMessage(HttpMethod.Get, url);
                foreach (var header in signedHeaders)
                {
                    request.Headers.Add(header.Key, header.Value);
                }

                var response = await client.SendAsync(request);
                response.EnsureSuccessStatusCode();
                var jsonResponse = await response.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<object>(jsonResponse);
            }
        }
    }
}
