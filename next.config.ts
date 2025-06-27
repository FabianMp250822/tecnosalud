import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.clinicadelacosta.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.invclicosta.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ceadi.edu.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cideacc.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'imareumatologia.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'emprender.edu.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
