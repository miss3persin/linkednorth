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
                hostname: '**.s3.amazonaws.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'some.otherhost.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'npnfuaxuxdyroswxjsvn.supabase.co',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
