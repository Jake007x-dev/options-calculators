/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "recharts",
    "recharts-scale",
    "d3-scale",
    "d3-shape",
    "d3-array",
    "d3-format",
    "d3-interpolate",
    "d3-path",
    "d3-time",
    "d3-time-format",
    "d3-color",
    "d3-ease",
  ],
};

export default nextConfig;
