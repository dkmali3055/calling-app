export const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiIyNjM2MGY0YS1hM2ViLTRmZTUtYjE0OS0xNjJiOTAyZmJiNjkiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTcwMjgyMTI2NiwiZXhwIjoxNzAzNDI2MDY2fQ.87yOIDNVcQfwGDDWPD6k6xUa4NKWdL306g1GUc2bK8s"; // token should be in String format

// API call to create meeting
export const createMeeting = async ({token}) => {
  const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
    method: 'POST',
    headers: {
      authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiIyNjM2MGY0YS1hM2ViLTRmZTUtYjE0OS0xNjJiOTAyZmJiNjkiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTcwMjgyMTI2NiwiZXhwIjoxNzAzNDI2MDY2fQ.87yOIDNVcQfwGDDWPD6k6xUa4NKWdL306g1GUc2bK8s`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });
  const {roomId} = await res.json();
  console.log('room id hhh', roomId);
  return roomId;
};
