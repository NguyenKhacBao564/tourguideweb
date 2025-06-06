// Update CORS configuration trong backend/server.js
// Thay thế block cors hiện tại với:

app.use(cors({
  origin: [
    'http://localhost:3000', // Development
    'http://54.219.205.247', // EC2 IP
    'http://tourguideeeee.fun', // Domain
    'http://www.tourguideeeee.fun', // WWW Domain
    'https://tourguideeeee.fun', // HTTPS Domain (future)
    'https://www.tourguideeeee.fun' // HTTPS WWW Domain (future)
  ],
  credentials: true, // Cho phép gửi cookie
})); 