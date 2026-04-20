/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permitir acceso CORS a recursos de desarrollo
  allowedDevOrigins: ['localhost:3000', 'localhost:3001', '127.0.0.1:3000', '127.0.0.1:3001'],
  
  // Optimizaciones
  compress: true,
  
  // Headers de seguridad
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
