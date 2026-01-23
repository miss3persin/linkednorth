/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'remotive.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'jobicy.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: '**.s3.amazonaws.com', // allow any S3 bucket
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'some.otherhost.com', // add any other external hosts you need
                port: '',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
